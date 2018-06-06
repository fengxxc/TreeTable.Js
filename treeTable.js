/* *
 * 将树形json数据转换成树形表格
 * @author ChenFeng
 * @version 1.0 2018-6-6
 * @see https://github.com/fengxxc/treeTable
 */
function TreeTable(opts) {
	var _opts = opts || {};
	var _id = _opts.tableId;
	var _data = _opts.treeData;
	var _footerCols = _opts.footerCols; // type is Array

	// private:
	function render(id, html) {
		var table = document.getElementById(id);
		if (table.tagName !== 'TABLE') {
			console.error('id的标签类型必须为"table"');
			return;
		}
		var tbody = table.getElementsByTagName('tbody')[0];
		tbody.innerHTML = html;
	}
	function getTableHtml(treeData) {
		var htmlStr = [];
		for (var i = 0; i < treeData.length; i++) {
			htmlStr.push(getCell([], treeData[i]));
		}
		var html = htmlStr.join('');
		return html;
	}
	function _getCell(htmlStr, nodeData) {
		// 占据的行数
		var colCount = nodeData.attributes.descendantCount || 1;
		htmlStr.push('<td rowspan="'+colCount +'">');
		htmlStr.push(nodeData.text+'');
		htmlStr.push('</td>');
		if (nodeData.child) { // 如果有后代
			var childNodes = nodeData.children;
			for (var i = 0; i < childNodes.length; i++)
				_getCell(htmlStr, childNodes[i]);
		} else {
			if (_footerCols) 
				htmlStr.push(getFooterCols(_footerCols));
			htmlStr.push('</tr>');
			htmlStr.push('<tr>');
		}
		return htmlStr;
	}
	function getCell(htmlStr, nodeData) {
		var htmlArr =  _getCell(htmlStr, nodeData);
		htmlArr.unshift(htmlArr.pop());
		return htmlArr.join('');
	}
	function getFooterCols(cols) {
		if (Object.prototype.toString.call(cols) != '[object Array]') {
			console.error('footerCols必须是数组');
			return '';
		}
		for (var i = 0, h = []; i < cols.length; i++) {
			h.push('<td>');
			h.push(cols[i]);
			h.push('</td>')
		}
		return h.join('');
	}
	// public:
	return { 
		setTreeData: function (data) {
			_data = data;
		},
		getTreeData: function () {
			return _data;
		},
		render: function (tableId) {
			var id = tableId || _id;
			render(id, getTableHtml(_data));
		}
	}
}