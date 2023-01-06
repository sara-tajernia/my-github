/**
 * remove not found modal
 */
function not_found() {
  document.getElementById("not-found").style.display = "none";
}
/**
 * remove server error modal
 */
function server_error() {
  document.getElementById("server-error").style.display = "none";
}
/**
 * remove localstorage modal
 */
function local_storage1() {
  console.log("sara");
  document.getElementById("local-storage").style.display = "none";
}
/**
 * @param  {string} method
 * @param  {string} url
 * send XMLHTTP request to input url and return response promise
 */
const makeRequest = (method, url) => {
  // define new xml request
  const xhr = new XMLHttpRequest();
  return new Promise((resolve) => {
    xhr.open(method, url, true);
    // onload function when request done
    xhr.onload = () =>
      resolve({
        status: xhr.status,
        response: xhr.responseText,
      });
    //   handle errors
    xhr.onerror = () => {
      resolve({
        status: xhr.status,
        response: xhr.responseText,
      });
      server_error = document.getElementById("server-error").style.display = "block";
    };
    xhr.send();
  });
};
/**
 * @param  {Event} e submit event
 * send request to get user datas and find most lang in 5 last pushed repos
 */
async function getinfo(e) {
  e.preventDefault();

  url = "https://api.github.com/users/";
  const username = document.getElementById("user-id").value;
//   check for localstorage
  if (username in localStorage) {
    var data = localStorage.getItem(username);
    data = JSON.parse(data);
    console.log(data);
    document.getElementById("avatar-url").src = data.avatar_url;
    document.getElementById("name").innerHTML = data.name;
    document.getElementById("blog").setAttribute("href", data.blog);
    document.getElementById("location").innerHTML = data.location;
    document.getElementById("bio").innerHTML = data.bio;
    document.getElementById("location").innerHTML = data.location;
    document.getElementById("bio").innerHTML = data.bio;
    document.getElementById("lang").innerHTML = 'Favorite language: ' + data.lang;
    server_error = document.getElementById("local-storage").style.display =
      "block";
  } else {
    // send request to get main data
    const request = await makeRequest("GET", url + username);
    if (request.status >= 200 && request.status <= 400) {
      var data = JSON.parse(request.response);
    // get user repos
      const request_repo = await makeRequest(
        "GET",
        data.repos_url + "?per_page=5&sort=pushed"
      );
      var request_repo_res = JSON.parse(request_repo.response);
      var languages = [];
      // find 5 repos languages
    //   get languages for user repos
      for (let i = 0; i < request_repo_res.length; i++) {
        var request_language = await makeRequest(
          "GET",
          request_repo_res[i].languages_url
        );
        languages.push(JSON.parse(request_language.response));
      }
      var max = 0;
      var lang = "";
      for (let i = 0; i < languages.length; i++) {
        for (key in languages[i]) {
          console.log(languages[i][key], key);
          if (languages[i][key] > max) {
            max = languages[i][key];
            lang = key;
          }
        }
      }
      data["lang"] = lang;
    //   change page content
      document.getElementById("avatar-url").src = data.avatar_url;
      document.getElementById("name").innerHTML = data.name;
      // if (data.blog != "") {
      //   document.getElementById("blog").setAttribute("href", data.blog);
      // }
      // else{
      //   document.getElementById("blog").innerHTML = "No blog";
      // }
      document.getElementById("blog").setAttribute("href", data.blog);
      document.getElementById("location").innerHTML = data.location;
      document.getElementById("bio").innerHTML = data.bio;
      document.getElementById("lang").innerHTML = 'Favorite language: ' + data.lang;

    // set local storage
      localStorage.setItem(username, JSON.stringify(data));
    } else {
      // if (request.status == 404) {
        not_found = document.getElementById("not-found").style.display = "block";
        document.getElementById("avatar-url").src = "assets/profile.jpg";
        document.getElementById("name").innerHTML = "Name";
        document.getElementById("blog").innerHTML = "Address link";
        document.getElementById("location").innerHTML = "Country/City";
        document.getElementById("bio").innerHTML = "Bio";
        document.getElementById("lang").innerHTML = "Favorite language";
      // }
      console.log("error");
    //   change page content for error handling
      // not_found = document.getElementById("not-found").style.display = "block";
      // document.getElementById("avatar-url").src = "assets/profile.jpg";
      // document.getElementById("name").innerHTML = "Name";
      // document.getElementById("blog").innerHTML = "Address link";
      // document.getElementById("location").innerHTML = "Country/City";
      // document.getElementById("bio").innerHTML = "Bio";
      // document.getElementById("lang").innerHTML = "Favorite language";
      // close = document.getElementById('signup').style.display='none'
    }
  }
}
// add event listenrs
document.getElementById("submit-btn").addEventListener("submit", getinfo);
document.getElementById("not-found").addEventListener("click", not_found);
document.getElementById("server-error").addEventListener("click", server_error);
document
  .getElementById("local-storage-btn")
  .addEventListener("click", local_storage1);

