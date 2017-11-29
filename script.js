// News API Functionality
$(document).ready(initializeApp);

function initializeApp () {
    $(".searchButton").click(getNewsData);
}

function getNewsData () {
    var nationalGeoAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=national-geographic&q="+ formatTextArea() +"+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from National Geo: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var abcAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=abc-news&q="+ formatTextArea() +"+climate&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from ABC news: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    var cnnAPIajaxOptions = {
        url: "https://newsapi.org/v2/everything?sources=cnn&q="+ formatTextArea() +"+environment&apiKey=626bed419f824271a515c974d606275b",
        success: function (data) {
            displayNewsData(data);
            console.log("Data received from CNN news: ", data);
        },
        error: function () {
            console.log("The data was not received.");
        }
    };
    $.ajax(abcAPIajaxOptions);
    $.ajax(nationalGeoAPIajaxOptions);
    $.ajax(cnnAPIajaxOptions);
}

function displayNewsData (data) {
    if ($(".searchNews").val() === "") {
        $(".searchNews").attr({
            placeholder: "Please enter keywords to search."
        });
        return;
    }
    for (var newsIndex = 0; newsIndex < data.articles.length; newsIndex++) {
        var newsTitle = data.articles[newsIndex].title;
        var newsSource = data.articles[newsIndex].source.name;
        var newsAuthor = data.articles[newsIndex].author;
        var newsLink = data.articles[newsIndex].url;
        var newsTitleDiv = $("<div>", {
            "class": "newsTitle",
            text: newsTitle
        });
        var newsAuthorDiv = $("<div>", {
            "class": "newsAuthor",
            text: "By: " + newsAuthor
        });
        var newsLinkTag = $("<a>", {
           text: newsTitle,
           href: newsLink
        });
        var newsSourceDiv = $("<div>", {
            "class": "newsSourceLink",
            text: "Source: " + newsSource
        });
        $(".newsListDisplay").append(newsTitleDiv, newsAuthorDiv, newsLinkTag, newsSourceDiv);
        // console.log(data.articles[newsIndex]);
    }
}
function formatTextArea () {
    var enteredText = $(".searchNews").val().split(" ").join("+");
    return enteredText;
}