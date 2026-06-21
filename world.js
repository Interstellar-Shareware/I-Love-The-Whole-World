const parser = new DOMParser();
color = 2;

//mmm javascript my beloved

function getPage(str, parent){
    fetchWikipediaHtml(str)
    .then(extract => parseLinks(extract, parent))
    .catch(error => console.log('Error:', error));
}

async function fetchWikipediaHtml(title) {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${title}&prop=text`);
    const data = await response.json();
    return data.parse.text['*'];
}

function parseLinks(htmlText, parent){
    doc = parser.parseFromString(htmlText, 'text/html');

    links = doc.querySelectorAll('a');

    for (let i = 0; i < links.length; i++){
        if (bigTest(links[i].pathname) && links[i].classList.length == 0 && !links[i].title.includes("Edit this at Wikidata") && document.getElementById(encodeURIComponent(links[i].title)) == null){
            node = document.createElement('div');

            shownTitle = links[i].title;
            uriTitle = encodeURIComponent(links[i].title);

            nodeInside = document.createElement('p');
            nodeInside.classList.add("nodeText");
            nodeInside.innerHTML = "! " + shownTitle;
            nodeInside.id = uriTitle;
            nodeInside.setAttribute("onclick", `fetchChildren("${uriTitle}")`);

            node.classList.add("box");
            node.appendChild(nodeInside);
            parent.appendChild(node);
        }
    }
}

function fetchChildren(title){
    parent = document.getElementById(title);

    if (parent.innerText.slice(0,2) == "! "){
        parent.innerText = parent.innerText.slice(2);
        parent.classList.add(("color") + color.toString());
        color = (color % 6) + 1;
        getPage(title, parent);
    }
}

function bigTest(path){
    if (path.includes("Portal:")) return false;
    if (path.includes("Help:")) return false;
    if (path.includes("Wikipedia:")) return false;
    if (path.includes("Special:")) return false;
    if (path.includes("Category:")) return false;
    if (path.includes("(disambiguation)")) return false;
    if (path.includes("File:")) return false;
    if (path.includes("Template:")) return false;
    if (path.includes("talk:")) return false;
    if (path.includes("Talk:")) return false;
    if (path.includes("/wiki/")) return true;
    return false;
}

aboutPopUp = null;

function showAbout(){

    if (aboutPopUp == null){
        aboutPopUp = document.getElementById("iltwwAbout");
    }

    aboutPopUp.hidden = false;
}

function hideAbout(){
    aboutPopUp.hidden = true;
}
