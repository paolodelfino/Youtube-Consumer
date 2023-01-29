/**
 * @type {Youtube}
 */
var youtube;

$(document).ready(function () {
  M.AutoInit();

  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  youtube = new Youtube();

  if ($(window).width() >= 1280){
    $("#search").focus();
  }
});

$("#search-form").submit(async function (e) {
  e.preventDefault();

  var query = $("#search").val();
  if (!query || !query.trim().lenght > 1) {
    return;
  }

  const result = await youtube.search(query);
  const videos = result.videos;

  $("#display").empty();

  videos.forEach((video) => {
    const div = document.createElement("div");
    div.setAttribute("videoId", video.id);
    div.onclick = (e) => openVideo(e);

    const html = `
      <div>
        <img src="${video.thumbnail}" alt="${video.title} image" />
        <span>${video.title}</span>
      </div>
      <div>
        <label>
          <input type="checkbox" class="filled-in"/>
          <span>Only Audio</span>
        </label>
        <div>
          <a class="waves-effect waves-light btn-small" onclick="downloadVideo(this)">Download</a>
        </div>
      </div>
      <div>
        <span>${video.publisher}</span>
      </div>
    `;

    div.innerHTML = html;

    $("#display").append(div);
  });
});

/**
 *
 * @param {HTMLLinkElement} a
 */
async function downloadVideo(a) {
  const div = a.parentElement.parentElement.parentElement;
  const videoId = div.getAttribute("videoId");
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const onlyAudio = div.querySelector("input[type=checkbox]").checked;

  a.classList.add("disabled");
  
  await youtube.download(url, { onlyAudio: onlyAudio });
  
  a.classList.remove("disabled");
}

/**
 *
 * @param {MouseEvent} e
 */
function openVideo(e) {
  const div = e.target;
  
  if (div.tagName !== "DIV") {
    return;
  }

  const videoId = div.getAttribute("videoId");
  const url = `https://www.youtube.com/embed/${videoId}`;

  window.open(url, "_blank");
}

function onYouTubeIframeAPIReady() {}

$("#download-from-url").click(async function () {
  const url = $("#url").val();
  if (!url || !url.trim().lenght > 1) {
    return;
  }

  const onlyAudio = $("#only-audio").is(":checked");

  this.classList.add("disabled");

  await youtube.download(url, { onlyAudio: onlyAudio });

  this.classList.remove("disabled");
});