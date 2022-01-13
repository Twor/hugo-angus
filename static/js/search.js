var fuse; // holds our search engine
var fuseIndex;
var searchQuery;


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
    httpRequest.open('GET', path);
    httpRequest.send();
}

function loadSearch(term) {
    fetchJSONFile('/index.json', function (data) {

        var options = { // fuse.js options; check fuse.js website for details
            shouldSort: true,
            location: 0,
            distance: 100,
            threshold: 0.4,
            minMatchCharLength: 2,
            keys: [
                'permalink',
                'title',
                'tags',
                'contents'
            ]
        };
        // Create the Fuse index
        fuseIndex = Fuse.createIndex(options.keys, data)
        fuse = new Fuse(data, options, fuseIndex); // build the index from the json file
        let results = fuse.search(term); // the actual query being run using fuse.js
        let searchitems = ''; // our results bucket

        if (results.length === 0) { // no results based on what was typed into the input box
            resultsAvailable = false;
            searchitems = '';
        } else { // build our html
            // console.log(results)
            permalinks = [];
            numLimit = 5;
            for (let item in results) { // only show first 5 results
                if (item > numLimit) {
                    break;
                }
                if (permalinks.includes(results[item].item.permalink)) {
                    continue;
                }
                //   console.log('item: %d, title: %s', item, results[item].item.title)
                searchitems = searchitems + '<li><a href="' + results[item].item.permalink + '" tabindex="0">' + '<span class="title">' + results[item].item.title + '</span></a></li>';
                permalinks.push(results[item].item.permalink);
            }
            resultsAvailable = true;
            console.log(searchitems);
            document.getElementsByClassName("post-list").innerHTML = searchitems;
        }

    });
}
