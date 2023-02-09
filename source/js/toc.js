function tocHelper(el) {
    let headingsMaxDepth = 6;
    let arr = ['h2', 'h3', 'h4', 'h5', 'h6'];
    let headingsSelector = arr.slice(0, headingsMaxDepth).join(',');
    let headings = $(el).find(headingsSelector);
    if (!headings.length) return '';
    let listNumber = false;
    let result = "<ul class='nav'>";
    let lastNumber = [0, 0, 0, 0, 0, 0];
    let firstLevel = 0;
    let lastLevel = 0;
    let i = 0;
    headings.each(function(index, domEle) {
        if (!$(domEle).hasClass("post-title")) {
            let level = arr.indexOf(this.localName) + 1;
            let text = $(this).text();
            let id = "t-" + $(this).attr("id");
            if (id) {
                id = id.replace(/\s+/g,"-");
            } else {
                id = text.replace(/\s+/g,"-")
            }
            id = id.replace(/\./g,"-");
            $(domEle).attr("id", id);
            lastNumber[level - 1]++;
            for (i = level; i <= 5; i++) {
                lastNumber[i] = 0
            }
            if (firstLevel) {
                for (i = level; i < lastLevel; i++) {
                    result += '</li></ul>'
                }
                if (level > lastLevel) {
                    result += '<ul class="nav-child">'
                } else {
                    result += '</li>'
                }
            } else {
                firstLevel = level
            }
            result += '<li class="nav-item nav-level-' + level + '">';
            result += '<a class="nav-link" href="#' + id + '">';
            if (listNumber) {
                result += '<span class="nav-number">';
                for (i = firstLevel - 1; i < level; i++) {
                    result += lastNumber[i]
                }
                result += '</span> '
            }
            result += '<span class="nav-text">' + text + '</span></a>';
            lastLevel = level
        }
    });
    for (i = firstLevel - 1; i < lastLevel; i++) {
        result += '</li></ul>'
    }
    return result
}