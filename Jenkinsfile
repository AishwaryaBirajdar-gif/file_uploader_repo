pipeline {
    agent any
    
    environment {
        // Use the NodeJS installation configured in Jenkins
        NODEJS_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation'
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"  // Ensure the correct path for Node.js
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub repository
                git 'https://github.com/AishwaryaBirajdar-gif/file_uploader_repo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Use NodeJS to install dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests if you have any (optional)
                    sh 'npm test' // If you have test scripts defined in package.json
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                script {
                    // Add any build commands or deployment steps
                    echo 'Build and deploy steps go here.'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline has finished.'
        }
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
