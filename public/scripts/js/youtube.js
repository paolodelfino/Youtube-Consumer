/**
 * @typedef {object} Video
 * @property {string} id
 * @property {string} title
 * @property {string} thumbnail
 * @property {string} publisher
 */

class Youtube {
  /**
   * @param {string} query
   * @returns {{
   * videos: Video[],
   * }}
   */
  async search(query) {
    const videos = await fetch("/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    });

    return videos.json();
  }

  /**
   *
   * @param {string} url
   * @param {{
   *  onlyAudio?: boolean,
   * }} options
   */
  async download(url, options) {
    const response = await fetch("/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        options: options,
      }),
    });

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.style.display = "none";
    a.href = blobUrl;

    const name = options.onlyAudio ? "audio.mp3" : "video.mp4";
    a.download = name;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(blobUrl);
    a.remove();
  }
}
