'use strict';

const searchURL = 'https://api.github.com/users/USERNAME/repos';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {
  console.log(responseJson);
  $('#results-list').empty();
 
  for (let i = 0; i < responseJson.value.length & i<maxResults ; i++){
    $('#results-list').append(
      `<li><h3><a href="${responseJson.value[i].url}">${responseJson.value[i].username}</a></h3>
      <p>${responseJson.value[i].username}</p>
      </li>`
    )};  
  $('#results').removeClass('hidden');
};


function findGitUserRepos(username, maxResults=10) {
  const params = {
    q: username,
    pageSize: maxResults,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  const options = {
    headers:  { 
      Accept: "application/vnd.github.v3+json" }
  };

  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}


function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const username = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    findGitUserRepos(username, maxResults);
  });
}

$(watchForm);
