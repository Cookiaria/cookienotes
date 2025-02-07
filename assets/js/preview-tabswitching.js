function toggleTransparency() {
    const spans = document.querySelectorAll('div.CodeMirror-code > pre > span');

    spans.forEach(span => {
        if (span.style.color === 'transparent') {
            span.style.color = '';
        } else {
            span.style.color = 'transparent'; 
        }
    });
}

document.querySelector('.fa-eye').addEventListener('click', toggleTransparency); 