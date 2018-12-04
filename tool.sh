#!/bin/bash
TC_UTIL_PROG_NAME=$(basename $0)
source ./.alicreds.sh
source ./.settings.sh
# ALIYUN_TUT_AK_ID, ALIYUN_TUT_AK_SECRET, ALIYUN_TUT_REGION
RELEASE_NAME="demo-proj"
HELM_REPO_NAME="demoproj"
alicmd () {
  aliyun --mode AK --access-key-id $ALIYUN_TUT_AK_ID --access-key-secret $ALIYUN_TUT_AK_SECRET -p demousr --region $ALIYUN_TUT_REGION "$@"
}
getk8stoken() {
  ./utils/get_kubetoken.sh -n $1 -u $2
}
helm_build_chart(){
  cd helm-chart-builder
  ./buildupload.sh "$ALIYUN_TUT_AK_ID" "$ALIYUN_TUT_AK_SECRET" "$ALIYUN_TUT_REGION" "$TC_TUT_HELM_REPO_BUCKET" "$1" "$TC_TUT_HELM_REPO_PATH" "$RELEASE_NAME" "$HELM_REPO_NAME" $2
  cd ..
}
helm_install_first(){
  SERVICE_NS="$1"
  kubectl create ns $SERVICE_NS
  cd utils
  ./createtilleruser.sh $SERVICE_NS "$TC_K8S_SERVER_CA" "$TC_K8S_SERVER_URL"
  kubectl create secret docker-registry $DOCKER_PULL_SECRET_NAME -n=$SERVICE_NS --docker-server=$DOCKER_SECRET_SERVER --docker-username=$DOCKER_SECRET_USER --docker-password=$DOCKER_SECRET_PASSWORD --docker-email="$DOCKER_SECRET_USER@$TC_K8S_GITLAB_DOMAIN_NAME"
  cd ..
}
install_chart_env() {
  SERVICE_NS="$1"
  helm repo add $HELM_REPO_NAME "https://$TC_TUT_HELM_REPO_BUCKET.oss-$ALIYUN_TUT_REGION.aliyuncs.com/$TC_TUT_HELM_REPO_PATH"
  helm install --name=${RELEASE_NAME} "$HELM_REPO_NAME/$RELEASE_NAME" --namespace=${SERVICE_NS} --tiller-namespace=${SERVICE_NS}
}
setup_helm_users() {
  echo "kube_config_dev"
  helm_install_first demo-dev
  echo "kube_config_staging"
  helm_install_first demo-staging
  echo "kube_config_prod"
  helm_install_first demo-prod
  helm_build_chart "0.1.0" "init"
  install_chart_env demo-dev
  install_chart_env demo-staging
  install_chart_env demo-prod

}
get_helm_oss_policy_doc() {
  echo "{\"Version\": \"1\", \"Statement\": [{\"Action\": [\"oss:GetObject*\", \"oss:PutObject*\"], \"Effect\": \"Allow\", \"Resource\": \"acs:oss:*:*:$1/$2/*\"}]}"
}

get_access_key_user() {
  local ramUser="$1"
  local akListOut="$(alicmd ram ListAccessKeys --UserName $ramUser)"

  if [[ $akListOut =~ AccessKeyId[^a-z|A-Z|0-9|=]*([a-z|A-Z|0-9|=]*) ]] ; then
    printf "${BASH_REMATCH[1]}"
    return 0
  else
    echo "Cannot find access key for account!"
    return 1
  fi
}
rm_all_access_keys_user() {
  local ramUser="$1"
  local akLast=$(get_access_key_user $ramUser)
  while [[ $? -eq 0 ]]; do
    alicmd ram DeleteAccessKey --UserName="$ramUser" --UserAccessKeyId "$akLast"
    akLast=$(get_access_key_user $ramUser)
  done
}

setup_oss_helm_repo() {
  local helmRepo="$TC_TUT_HELM_REPO_BUCKET"
  local helmRepoPath="$TC_TUT_HELM_REPO_PATH"
  local ramUser="$TC_TUT_HELM_RAM_USER"
  local ramPolicyName="$TC_TUT_HELM_RAM_POLICY"
  alicmd oss mb "oss://$helmRepo" --acl public-read
  alicmd ram CreateUser --UserName="$ramUser"
  HELM_REPO_ACCESS_KEY_INFO=$(alicmd ram CreateAccessKey --UserName="$ramUser")
  echo $(echo $HELM_REPO_ACCESS_KEY_INFO | base64)
  alicmd ram CreatePolicy --PolicyName="$ramPolicyName" --Description="$ramPolicyName" --PolicyDocument="$(get_helm_oss_policy_doc $helmRepo $helmRepoPath)"
  alicmd ram AttachPolicyToUser --PolicyType="Custom" --UserName="$ramUser" --PolicyName="$ramPolicyName"
}

setup_oss_helm_repo_teardown() {
  local helmRepo="$TC_TUT_HELM_REPO_BUCKET"
  local helmRepoPath="$TC_TUT_HELM_REPO_PATH"
  local ramUser="$TC_TUT_HELM_RAM_USER"
  local ramPolicyName="$TC_TUT_HELM_RAM_POLICY"
  alicmd oss rm --bucket "oss://$helmRepo" -f
  alicmd ram DetachPolicyFromUser --UserName="$ramUser" --PolicyName="$ramPolicyName" --PolicyType="Custom"
  rm_all_access_keys_user $ramUser
  alicmd ram DeleteUser --UserName="$ramUser"
  alicmd ram DeletePolicy --PolicyName="$ramPolicyName"
}

deploy_kubedash(){
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
cat <<EOF | kubectl create -f -
apiVersion: v1
kind: ServiceAccount
metadata:
  name: $TC_K8S_ADMIN_USER_DASHBOARD
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRoleBinding
metadata:
  name: $TC_K8S_ADMIN_USER_DASHBOARD
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: $TC_K8S_ADMIN_USER_DASHBOARD
  namespace: kube-system
EOF
getk8stoken kube-system $TC_K8S_ADMIN_USER_DASHBOARD
}

install_gitlab_runner (){
  helm repo add gitlab https://charts.gitlab.io
  helm repo update
  helm upgrade --install gitlab-runner gitlab/gitlab-runner \
  --namespace $TC_K8S_GITLAB_RUNNER_NAMESPACE \
  --reuse-values \
  --set rbac.create=true \
  --set gitlabUrl="https://$TC_K8S_GITLAB_DOMAIN_NAME/" \
  --set runnerRegistrationToken="$TC_K8S_GITLAB_RUNNER_TOKEN"
  
}

helm_init_local(){
  helm init --client-side

}

sub_kubedashsetup(){
  deploy_kubedash
}


sub_appcert(){
  ./utils/letsenc.sh $BASE_APP_DEPLOY_DOMAIN $TC_K8S_SSL_EMAIL
}

sub_help(){
    echo "Usage: $ProgName <subcommand> [options]\n"
    echo "Subcommands:"
    echo "    kubedashsetup             Setup the kubernetes dashboard and create an admin token"
    echo "    osshelmsetup              Setup a helm repository and RAM user"
    echo "    setuphelmk8s              Setup tiller helm users and deployments"
    echo "    configurealiyun           Configure aliyun cli"
    echo "    helmsetupclear            Clean up the osshelmsetup command"
    echo "    ktok <namespace> <user>   Get token for kubernetes user"
    echo "    setupglrunner             Setup gitlab runner"
    echo "    appcert                   Setup ssl cert for application"
    echo ""
    echo "For help with each subcommand run:"
    echo "$ProgName <subcommand> -h|--help"
    echo ""
}
sub_setupglrunner() {
  install_gitlab_runner
}

sub_configurealiyun(){
  mv ~/.aliyun/old-config.json ~/.aliyun/old-config-2.json &> /dev/null
  mv ~/.aliyun/config.json ~/.aliyun/old-config.json &> /dev/null
  aliyun configure --profile demousr set --mode AK --access-key-id $ALIYUN_TUT_AK_ID --access-key-secret $ALIYUN_TUT_AK_SECRET --region $ALIYUN_TUT_REGION
}
sub_setuphelmk8s(){
  setup_helm_users
}

sub_osshelmsetup(){
  setup_oss_helm_repo
}
sub_helmsetupclear(){
  setup_oss_helm_repo_teardown
}

sub_installgitlab(){
  install_gitlab_k8s
}
sub_ktok() {
  getk8stoken $1 $2
}

subcommand=$1
case $subcommand in
    "" | "-h" | "--help")
        sub_help
        ;;
    *)
        shift
        sub_${subcommand} $@
        if [ $? = 127 ]; then
            echo "Error: '$subcommand' is not a known subcommand." >&2
            echo "       Run '$ProgName --help' for a list of known subcommands." >&2
            exit 1
        fi
        ;;
esac
