/**
 * Notice Bar
 * config/notice.js の設定にもとづいて、お知らせバナーを描画する
 */
(function () {
  var config = window.NOTICE_CONFIG || {};
  var message = (config.message || '').trim();

  // show:false または文言が空の場合はバナーごと非表示
  if (!config.show || !message) {
    return;
  }

  var bar = document.createElement('div');
  bar.className = 'notice-bar';
  bar.id = 'notice-bar';
  bar.setAttribute('role', 'status');

  var text = document.createElement('p');
  text.textContent = message;
  bar.appendChild(text);

  if (config.link && config.link.url && config.link.text) {
    var link = document.createElement('a');
    link.href = config.link.url;
    link.textContent = config.link.text;
    bar.appendChild(link);
  }

  document.body.insertBefore(bar, document.body.firstChild);

  var updateOffset = function () {
    document.documentElement.style.setProperty('--notice-bar-height', bar.offsetHeight + 'px');
  };

  updateOffset();
  window.addEventListener('resize', updateOffset);
  window.addEventListener('load', updateOffset);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateOffset);
  }
})();
