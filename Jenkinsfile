
pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'aishwarya2306/file-uploader'  // Change this to your Docker Hub username and repo
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub')      // Jenkins credentials ID for Docker Hub
    }
    stages {
        stage('Clone Repository') {
            steps {
                // Cloning the repository from GitHub
                git 'https://github.com/AishwaryaBirajdar-gif/file_uploader_repo.git'  // Change this to your repo URL
            }
        }
        stage('Build Docker Image') {
            steps {
                // Build the Docker image
                script {
                    docker.build(DOCKER_IMAGE)
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                // Push the Docker image to Docker Hub
                script {
                    docker.withRegistry('https://registry.hub.docker.com', DOCKER_HUB_CREDENTIALS) {
                        docker.image(DOCKER_IMAGE).push()
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                // Deploy the application to Kubernetes
                script {
                    sh 'kubectl apply -f kubernetes/deployment.yaml'
                    sh 'kubectl apply -f kubernetes/service.yaml'
                }
            }
        }
    }
}
