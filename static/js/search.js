var fuse; // holds our search engine
var searchitems;

// ==========================================
// execute search as each character is typed

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return decodeURI(pair[1]);
        }
    }
    return (false);
}

// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path, false);
    httpRequest.send();
}


function tags(tags) {
    var tag = '';
    for (let index = 0; index < tags.length; index++) {
        tag = tag + ' #' + tags[index];
    }
    return tag
}

// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function executeSearch(term) {
    if (term.length == 0) {
        return false;
    } else {
        fetchJSONFile('/index.json', function (data) {
            var options = { // fuse.js options; check fuse.js website for details
                shouldSort: true,
                location: 0,
                distance: 100,
                threshold: 0.4,
                minMatchCharLength: 2,
                keys: [
                    'title',
                    'tags',
                    'content'
                ]
            };
            fuse = new Fuse(data, options); // build the index from the json file
            let results = fuse.search(term); // the actual query being run using fuse.js
            searchitems = ''; // our results bucket

            if (results.length == 0) { // no results based on what was typed into the input box
                searchitems = 0;
            } else { // build our html
                for (let item in results.slice(0, 8)) { // only show first 5 results
                    searchitems = searchitems + '<li class="post-item grid-item" itemscope itemtype="http://schema.org/BlogPosting"><a class="post-link" href="' + results[item].item.permalink + '"><h3 class="post-title"><time class="index-time" itemprop="datePublished">' + results[item].item.date + '</time><br>' + results[item].item.title + '</h3><div class="post-meta">' + tags(results[item].item.tags) + '</div></a></li>';
                }
            }
        });
        return searchitems;
    }

}
