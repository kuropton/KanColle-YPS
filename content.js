//------------------------------------------------------------------------
// DOM生成.
//
var div = document.createElement('div');
div.classList.add('yps-body');
div.innerHTML = "艦これ余所見プレイ支援"
	+ version_banner()
	+ "<h3>ロード中...</h3>"
	+ "ゲームスタート後に「ロード完了」が表示されない場合は[デベロッパー ツール]を起動し、画面をリロードしてゲームスタートからやり直してください\n"
	+ "※ デベロッパーツールは、Opt+Cmd+I(Mac), Ctrl+Shift+I, F12 キーで起動できます\n"
	+ "※ chrome://extensions を開いて、KanColle-YPS の有効チェックが外れていないか確認してください\n"
	+ "任務遂行のデバイス間同期を有効にするには chrome://settings/syncSetup を開いて「拡張機能」の同期を有効にしてください\n"
	;

var hst = document.createElement('div');
hst.classList.add('yps-body');
hst.classList.add('yps-history');
hst.YPS_HTMLarray = [];	// html履歴配列.
hst.YPS_HTMLcursor = 0;	// 履歴表示位置.

var navi = document.createElement('div');
navi.classList.add('yps-body');
navi.classList.add('yps-navi');

document.body.appendChild(navi);
document.body.appendChild(div);

//------------------------------------------------------------------------
// ゲーム画面の配置調整.
//
document.getElementById('w').style.textAlign = 'left';
document.getElementById('w').style.width = '1230px';
//document.getElementById('area-game').style.textAlign = 'left';
//document.getElementById('game_frame').width = '820px';
//document.getElementById('ntg-recommend').style.display = 'none';

//------------------------------------------------------------------------
// DOM制御.
//
var $target_display = {};	// DOM.Id をキーとした、表示/非表示のbool
var $button_onclick = {};	// DOM.Id をキーとした、onclick-function

function update_button_target() {
	for (let btn_id in $button_onclick) {
		let b = document.getElementById(btn_id);
		if (b) b.onclick = $button_onclick[btn_id];
	}
	for (let id in $target_display) {
		let e = document.getElementById(id);
		if (e) {
			e.open = $target_display[id];
			e.addEventListener("toggle", function(evt) {
				$target_display[id] = e.open;
			}, false);
		}
	}
}

function insert_string(str, index, add) {
	return str.substring(0, index) + add + str.substring(index);
}

function all_close_button() {
	$button_onclick["YPS_allclose"] = function() {
		for (let e of document.getElementsByClassName('detailmain')) {
			e.open = false; $target_display[e.id] = false;
		}
	};
	return '<input id="YPS_allclose" type="button" value="全閉">';
}

function toggle_details(id, a) {
	$target_display[id] = ($target_display[id] || false);
	return '<details class="detailmain" id="<ID>">'.replace(/<ID>/g, id) + parse_markdown(a) + '</details>'
}

function fixup_details() {
	for (let e of document.getElementsByClassName('detailmain')) {
		let pe = e.parentElement;
		let ppe = pe.parentElement;
		if (!ppe || e.classList.contains('fixup')) continue; // 親なしやfixup済みなら何もしない.
//		pe.removeChild(e);
		ppe.replaceChild(e, pe); // 親の位置にeを置く.
		let s = document.createElement('summary');
		e.insertBefore(s, e.firstElementChild);
		s.appendChild(pe); // 元の親をサマリーに入れる.
		e.classList.add('markdown' + pe.tagName);
		e.classList.add('fixup');
		s.className = 'markdown';
	}
}

function tooltip_span(a) {
	return '<span class="tooltip">' + parse_markdown(a) + '</span>';
}

function fixup_tooltip() {
	for (let e of document.getElementsByClassName('tooltip')) {
		let pe = e.parentElement;
		if (pe.tagName == 'TD') {
			pe = pe.parentElement;
		}
		if (/toolmain/.test(pe.className)) continue;
		pe.classList.add("toolmain"); // tooltipクラスの親ノードに、toolmainクラスを設定する.
	}
}

//------------------------------------------------------------------------
// markdown -> html 変換.
//
function parse_markdown(a) {
	var html = "";
	var li_count = 0;
	var tr_count = 0;
	for (var i = 0; i < a.length; ++i) {
		var s = a[i];
		var t = null;
		if (s instanceof Array) {	// 入れ子ブロック. [id, line1, line2, line3...]
			const id = s.shift();
			const end_tag = html.match(/<\/\w+>$/);
			if (id == 'tooltip') {
				s = tooltip_span(s);
			}
			else {
				s = toggle_details(id, s);
			}
			if (end_tag != null)
				html = insert_string(html, html.length - end_tag[0].length, s); // 直前の終了タグの内側に入れ子内容を入れる.
			else
				html += s;
			continue;
		}
		// エスケープを行う.
		s = s.replace(/\&/g, "&amp;");
		s = s.replace(/\</g, "&lt;");
		s = s.replace(/\>/g, "&gt;");
		// 色付け.
		s = s.replace(/撃沈---/g, '<span style="color:steelblue">$&</span>');
		s = s.replace(/大破!!!/g, '<span style="color:red">$&</span>');
		s = s.replace(/!!修理..発動/g, '<span style="color:red">$&</span>');
		s = s.replace(/MISS!!/g, '<span style="color:red">$&</span>'); // 判定ミスを着色する.
		s = s.replace(/:(中破)/g, ':<span style="text-shadow:0 0 0.5em orange">$1</span>');
		s = s.replace(/:(小破)/g, ':<span style="text-shadow:0 0 0.5em yellow">$1</span>');
		s = s.replace(/^出撃中:/g, '<span style="text-shadow:0 0 1em lime">$&</span>');
		s = s.replace(/^遠征\d+/g, '<span style="text-shadow:0 0 1em cyan">$&</span>');
		s = s.replace(/遂行中/g,   '<span style="text-shadow:0 0 1em yellow">$&</span>');
		s = s.replace(/遂行.0%/g,  '<span style="text-shadow:0 0 1em orange">$&</span>');
		s = s.replace(/達成!!/g,   '<span style="text-shadow:0 0 1em cyan">$&</span>');
		s = s.replace(/^\t(クリア済)\t(.+)/, '\t<span style="color:slategray">$1</span>\t<span style="color:slategray">$2</span>');
		s = s.replace(/@!!(輸送.級)!!@/g, '<span style="color:limegreen">$1</span>');
		s = s.replace(/@!!(空母.[級姫鬼])!!@/g, '<span style="color:darkorange">$1</span>');
		s = s.replace(/@!!(軽母.[級姫鬼])!!@/g, '<span style="color:orange">$1</span>');
		s = s.replace(/@!!(潜水.[級姫鬼])!!@/g, '<span style="color:deeppink">$1</span>');
		s = s.replace(/@!!([^!]+)!!@/g, '<span style="color:red">$1</span>');
		// markdown書式を変換する.
		if      (/^--+/.test(s))	t = "<hr>";
		else if (/^#### /.test(s))	t = s.replace(/^#+ (.+)/, '<h5 class="markdownH5">$1</h5>');
		else if (/^### /.test(s))	t = s.replace(/^#+ (.+)/, '<h4 class="markdownH4">$1</h4>');
		else if (/^## /.test(s))	t = s.replace(/^#+ (.+)/, '<h3 class="markdownH3">$1</h3>');
		else if (/^# /.test(s))		t = s.replace(/^#+ (.+)/, '<h2 class="markdownH2">$1</h2>');
		else if (/^\* /.test(s))	{ t = s.replace(/^. (.+)/, "<li>$1</li>"); li_count++; }
		else if (/^\t/.test(s))		{ t = '<tr>' + s.replace(/\t/g, '</td><td>') + '</tr>'; tr_count++;
									  t = t.replace(/<tr><\/td>/, '<tr>');
									  t = t.replace(/<td>\|(.*)(?=<td|<\/tr)/g, function(match, p1) {	// "\t|" は :,で折り返し有とする.
										return '<td>' + p1.replace(/[,:] /g, '$&<wbr>');
									  });
									  t = t.replace(/<td>  /g, '<td style="text-align:right;">'); // "\t  " は右寄せする.
									  t = t.replace(/<td>==/g, '<th>'); // "\t==" はヘッダセル.
									}
		// リストを<ul>で括る.
		if (li_count == 1) html += '<ul class="markdown">';
		if (li_count > 0 && !/^<li>/.test(t)) { li_count = 0; html += "</ul>"; } 
		// テーブルを<table>で括る.
		if (tr_count == 1) html += '<table class="markdown">';
		if (tr_count > 0 && !/^<tr>/.test(t)) { tr_count = 0; html += "</table>"; } 
		// 変換結果をhtmlに格納する.
		if (t) html += t;
		else   html += '<div>' + s + '</div>';
	}
	// リスト、テーブルの括り漏れに対処する.
	if (li_count > 0) { html += "</ul>"; } 
	if (tr_count > 0) { html += "</table>"; } 
	return html;
}

//------------------------------------------------------------------------
// 履歴保存.
//
function push_history(html) {
	var ha = hst.YPS_HTMLarray;
	if (/^\s*<h/.test(html)) return;		// 先頭行がhタグで始まる任務確認表示は保存対象外とする.
	if (ha[ha.length-1] == html) return;	// 前回保存と等しいならば保存しない.
	if (ha.push(html) > 50) {
		ha.shift(); // 50を超えたら古いものから削除する.
	}
}
function pop_history() {
	hst.YPS_HTMLarray.pop();
}

function update_histinfo() {
	var e = document.getElementById('YPS_histinfo');
	if (!e) return;
	var len = hst.YPS_HTMLarray.length;	// 履歴総数.
	var pos = hst.YPS_HTMLcursor + 1;	// 履歴表示位置.
	if (div.parentNode)
		e.textContent = 'x' + len;			// 通常表示中は "x履歴総数" を表示する.
	else
		e.textContent = pos + '/' + len;	// 履歴表示中は "履歴表示位置/履歴総数" を表示する.
}

function history_buttons() {
	$button_onclick["YPS_rev"] = function() {
		var ha = hst.YPS_HTMLarray;
		var i  = hst.YPS_HTMLcursor;
		if (ha.length < 1) return;	// 履歴無しなら何もしない.
		if (div.parentNode) {
			document.body.replaceChild(hst, div); // 履歴表示開始.
			i = ha.length;
		}
		if (--i < 0) i = 0;
		hst.innerHTML = ha[hst.YPS_HTMLcursor = i];
		update_button_target();
		update_histinfo();
	};
	$button_onclick["YPS_fwd"] = function() {
		var ha = hst.YPS_HTMLarray;
		var i  = hst.YPS_HTMLcursor;
		if (div.parentNode) return; // 履歴表示中以外は何もしない.
		if (++i >= ha.length) {
			document.body.replaceChild(div, hst); // 履歴表示を中断する.
		}
		else {
			hst.innerHTML = ha[hst.YPS_HTMLcursor = i];
		}
		update_button_target();
		update_histinfo();
	};
	return ' <input id="YPS_rev" type="button" value="◀"/>'
		+ ' <input id="YPS_fwd" type="button" value="▶"/>'
		+ ' 履歴<span id="YPS_histinfo"></span>'
		;
}

function version_banner() {
	var ver_name = chrome.runtime.getManifest().version_name;
	return ' <a href="http://hkuno9000.github.io/KanColle-YPS/" target="KanColle-YPS-website">KanColle-YPS ' + ver_name + '</a>';
}

//------------------------------------------------------------------------
// 表示内容受信.
//
chrome.runtime.onMessage.addListener(function (req) {
	if (!div.parentNode) document.body.replaceChild(div, hst); // 履歴表示を中断する.
	if (req instanceof Array) {
		div.innerHTML = parse_markdown(req);
		navi.innerHTML = all_close_button() + history_buttons() + version_banner();
	}
	else if (req.appendData) {
		pop_history();
		div.innerHTML += parse_markdown(req.appendData);
	}
	else { // may be String
		pop_history();
		div.innerHTML += parse_markdown([req]);
	}
	fixup_details();
	fixup_tooltip();
	push_history(div.innerHTML);	// 履歴に追加する.
	update_button_target();			// 更新したHTMLに対して、ターゲット表示/非表示を反映する.
	update_histinfo();				// 履歴個数表示を更新する.
});
