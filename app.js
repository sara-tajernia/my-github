function not_found(){
    document.getElementById('not-found').style.display='none'
}

function server_error(){
    document.getElementById('server-error').style.display='none'
}

function local_storage1(){
    console.log('sara')
    document.getElementById('local-storage').style.display='none'
}

async function getinfo(e) {
    e.preventDefault();
    var request = new XMLHttpRequest()    
    url = 'https://api.github.com/users/'
    const username = document.getElementById("user-id").value
    if (username in localStorage) {
        var data = localStorage.getItem(document.getElementById("user-id").value)
        data=JSON.parse(data)
        console.log(data)
        document.getElementById("avatar-url").src = data.avatar_url
        document.getElementById("name").innerHTML = data.name
        document.getElementById("blog").setAttribute('href', data.blog)
        document.getElementById("location").innerHTML = data.location
        document.getElementById("bio").innerHTML = data.bio
        document.getElementById("location").innerHTML = data.location
        server_error = document.getElementById('local-storage').style.display='block'
    }else{
        request.open('GET', url + document.getElementById("user-id").value, true)
        request.onload = function () {
        var data = JSON.parse(this.response)
            if (request.status >= 200 && request.status < 400) {
                console.log('success', data)
                document.getElementById("avatar-url").src = data.avatar_url
                document.getElementById("name").innerHTML = data.name
                document.getElementById("blog").setAttribute('href', data.blog)
                document.getElementById("location").innerHTML = data.location
                document.getElementById("bio").innerHTML = data.bio
                localStorage.setItem(document.getElementById("user-id").value, this.response);
            }

            else {
                console.log('error')
                not_found = document.getElementById('not-found').style.display='block'
                document.getElementById("avatar-url").src = "assets/profile.jpg"
                document.getElementById("name").innerHTML = "Name"
                document.getElementById("blog").innerHTML = "Address link"
                document.getElementById("location").innerHTML = "Country/City"
                document.getElementById("bio").innerHTML = "Bio"
                // close = document.getElementById('signup').style.display='none'
            }
        }
        request.onerror= function(e) {
            server_error = document.getElementById('server-error').style.display='block'
        };
        request.send()
    }
}

document.getElementById('submit-btn').addEventListener('submit', getinfo)
document.getElementById('not-found').addEventListener('click', not_found)
document.getElementById('server-error').addEventListener('click', server_error)
document.getElementById('local-storage-btn').addEventListener('click', local_storage1)

// GIT_REPO="https://api.github.com/repos/kubernetes/kubernetes" # Input Git Repo
// BRANCH_NAME="master"                                          # Input Branch Name
// COMMITS_NUM="5"                                               # Input to get last "N" number of commits

// curl --silent --insecure --request GET --header "Accept: application/vnd.github.inertia-preview+json" "$GIT_REPO/commits?sha=$BRANCH_NAME&page=1&per_page=1000" | jq --raw-output '.[] | "\(.sha)|\(.commit.author.date)|\(.commit.message)|\(.commit.author.name)|\(.commit.author.email)" | gsub("[\n\t]"; "")' | awk 'NF' | awk '{$1=$1;print}' | head -$COMMITS_NUM