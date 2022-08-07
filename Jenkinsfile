properties([pipelineTriggers([githubPush()])])

pipeline {

    /* specify nodes for executing */
    agent any


    // setup parameter for docker image tag
    parameters {
      booleanParam(name: "DEPLOYED", defaultValue: true)
      string(name: "IMAGE_TAG", defaultValue: "1.3", description: "This tag is for creating the Docker Image.")
    }

    stages {

        // create docker image
        stage('DockerImage') {
          steps {

            echo "Creating the docker image for the web app by giving Dockerfile."
            sh "sudo podman build -t hemendra05/yelp-camp:${params.IMAGE_TAG} ."
            sh "sudo podman push hemendra05/yelp-camp:${params.IMAGE_TAG}"
            echo "Successfully ceated the image and push to the docker repository."

          }
        }

        // deploying the webapp
        stage('KubernetesDeploy') {
          steps {

            script {

              // deploy the app if it's not already been deployed
              if (params.DEPLOYED) {

                echo "Rolling out to new version of the App."
                sh "sudo kubectl set image deployment/yelp-deployment yelp-camp=hemendra05/yelp-camp:${params.IMAGE_TAG}"
                sh "sudo kubectl get svc"
                echo "The App has been rollout Successfully!!"

              } else {           // else rollout to new version if we have chnage in app

                echo "Deploying this Application on the Kubernetes Cluster."
                sh "sudo kubectl apply -f deployApp.yml"
                sh "sudo kubectl get deploy"
                sh "sudo kubectl get po"
                sh "sudo kubectl get svc"
                echo "Successfully Deployed the App."

              }
            }
          }
        }
    }
}
