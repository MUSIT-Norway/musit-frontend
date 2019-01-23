
def proxyServer = 'http://w3prod-proxy01.uio.no:3128'

node {
    stage('Checkout') {
        def scmVars = checkout(scm)
        gitCommit = scmVars.GIT_COMMIT
        gitBranch = scmVars.GIT_BRANCH
        buildTag = "B${env.BUILD_NUMBER}-${gitCommit}"
        echo "$scmVars"
        echo sh(script: 'env|sort', returnStdout: true)
        sh 'pwd'
    }
    
    stage('Test') {
        echo "Run tests"
        echo "skiping for now..."
        echo "Branch: ${gitBranch}\nCommit: ${gitCommit}"
        def nodeImg = docker.image('harbor.uio.no:443/musit/docker-node')
        nodeImg.pull()
        nodeImg.inside {
            sh "npm config set proxy ${proxyServer}"
            sh "npm config set https-proxy ${proxyServer}"
            sh 'npm --version'
            sh "npm install"
            sh "# npm run flow"
            sh "# Check formatting"
            sh "npm run formatcode"
            sh "git status"
            sh 'git diff --exit-code src/ || (echo "ERROR The codebase isnt formatted! See list of files above"; false)'
            sh '# Run tests'
            sh "CI=true npm run test"
            echo "Finished running tests"
        }
    }

    if (gitBranch == "master") {
        stage('Build') {
            echo "Build images for branch ${gitBranch}"
            echo "Tag: ${buildTag}"
            def nodeImgStr = sh(
                script: "grep 'FROM' Dockerfile",
                returnStdout: true
            ).replace("FROM","").trim()

            nodeImgFullPath = "harbor.uio.no:443/library/${nodeImgStr}"
            echo nodeImgFullPath
            def nodeImg = docker.image("${nodeImgFullPath}")
            nodeImg.pull()
            sh "sed -e 's/FROM node/FROM harbor.uio.no:443\\/library\\/node/g' Dockerfile > Dockerfile.tmp && mv Dockerfile.tmp Dockerfile"
            sh "sed -i 's/LOCAL_DEVELOPMENT/${gitCommit}/g' src/build.ts"
            sh "docker build --build-arg http_proxy=${proxyServer} --build-arg https_proxy=${proxyServer} -t harbor.uio.no:443/musit/webpack ."
            sh "docker tag harbor.uio.no:443/musit/webpack harbor.uio.no:443/musit/webpack:${buildTag}"
            sh "docker tag harbor.uio.no:443/musit/webpack harbor.uio.no:443/musit/webpack:utv"
        }
        
        if (gitBranch == "master") {

            stage('Publish to harbor') {
                echo "Push ${gitBranch} to harbor"
                echo "Tag: ${buildTag}"
                sh "docker push harbor.uio.no:443/musit/webpack"
                sh "docker push harbor.uio.no:443/musit/webpack:utv"
                sh "docker push harbor.uio.no:443/musit/webpack:${buildTag}"
            }
        }

        stage('Delete old images') {
            def docker-images-cleanup = "jenkins/docker-images-cleanup.sh"
            sh docker-images-cleanup
        }

        stage('Mirror to GitHub') {
            echo "Mirror to gitHub not implemented yet"
            // gitHubBranchName = "${gitBranch}-Temp" //Remove "-Temp" when mirroring from GitLab is off
            // withCredentials([string(credentialsId: 'GitHubMirrorToken', variable: 'GIT_HUB_MIRROR_TOKEN')]) {
            //     echo "push branch ${gitBranch} to github as branch ${gitHubBranchName}"
            //     sh "git push https://git:${GIT_HUB_MIRROR_TOKEN}@github.com/MUSIT-Norway/musit-frontend.git HEAD:${gitHubBranchName}"
            // }
       }
    }
}
