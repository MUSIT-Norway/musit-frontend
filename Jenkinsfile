
def proxyServer = 'http://w3prod-proxy01.uio.no:3128'
def deployJenkinstest = false

node {
    stage('Checkout') {
        scmVars = checkout(scm)
        echo "scmVars.GIT_COMMIT: ${scmVars.GIT_COMMIT}"
        echo "scmVars.GIT_BRANCH: ${scmVars.GIT_BRANCH}"
        commithash = scmVars.GIT_COMMIT
        branchname = scmVars.GIT_BRANCH
        echo "${scmVars}"
        echo "deployJenkinstest: ${deployJenkinstest}"
        sh 'pwd'
        sh 'ls -al'
        sh 'git --version'
        sh 'git remote -v'
        sh 'git branch -avv'
        sh 'pwd'
        sh 'ls -al ~/.ssh'
        sh 'whoami'
        sh 'ls -al'
        //echo "Testing secret $TestSecret"
        echo "${env.TestSecret}"

        //sh 'git remote show origin'
        //sh 'git fetch git@github.com:MUSIT-Norway/musit-frontend.git jenkinstest'
        
    }
    
    // stage('Test') {
    //     echo "Run tests for branch ${branchname}"
    //     def nodeImg = docker.image('harbor.uio.no:443/musit/docker-node')
    //     nodeImg.pull()
    //     nodeImg.inside {
    //         sh "npm config set proxy ${proxyServer}"
    //         sh "npm config set https-proxy ${proxyServer}"
    //         sh 'npm --version'
    //         sh "npm install"
    //         sh "# npm run flow"
    //         sh "# Check formatting"
    //         sh "npm run formatcode"
    //         sh "git status"
    //         sh 'git diff --exit-code src/ || (echo "ERROR The codebase isnt formatted! See list of files above"; false)'
    //         sh '# Run tests'
    //         sh "CI=true npm run test"
    //         echo "Finished running tests"
    //     }
    // }

    // if (branchname == "master" || branchname == "jenkinstest") {
    //     stage('Build') {
    //         echo "Build images for branch ${branchname}"
    //         sh "sed -e 's/FROM node/FROM harbor.uio.no:443\\/library\\/node/g' Dockerfile > Dockerfile.tmp && mv Dockerfile.tmp Dockerfile"
    //         sh "sed -i 's/LOCAL_DEVELOPMENT/${commithash}/g' src/build.ts"
    //         sh "docker build --build-arg http_proxy=${proxyServer} --build-arg https_proxy=${proxyServer} -t harbor.uio.no:443/musit/webpack ."
    //         sh "docker tag harbor.uio.no:443/musit/webpack harbor.uio.no:443/musit/webpack:${commithash}"
    //         sh "docker tag harbor.uio.no:443/musit/webpack harbor.uio.no:443/musit/webpack:utv"
    //     }
        
    //     if (branchname == "master" || (branchname == "jenkinstest" && deployJenkinstest)) {
    //         stage('Publish to harbor') {
    //             echo "Push ${branchname} to harbor (not implemented yet)"
    //             // sh "docker push harbor.uio.no:443/musit/webpack"
    //             // sh "docker push harbor.uio.no:443/musit/webpack:utv"
    //             // sh "docker push harbor.uio.no:443/musit/webpack:${commithash}"
    //         }
    //     }
    //     stage('Delete old images') {
    //         sh 'docker images'
    //         sh 'docker ps -a'

    //         sh 'docker images harbor.uio.no:443/musit/webpack --filter "before=harbor.uio.no:443/musit/webpack:latest"'
    //         sh 'docker images harbor.uio.no:443/musit/webpack --filter "before=harbor.uio.no:443/musit/webpack:latest" -q --no-trunc | xargs --no-run-if-empty docker rmi'

    //         sh 'docker images --filter "dangling=true" --no-trunc'
    //         sh 'docker images --filter "dangling=true" -q --no-trunc | xargs --no-run-if-empty docker rmi'
    //     }
    // }
}
