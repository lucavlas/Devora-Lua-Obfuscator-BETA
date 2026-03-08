function minifyLua(src) {
    return src
        .replace(/--.*$/gm, "") 
        .replace(/\s+/g, " ")
        .trim();
}

function encodeStringsXOR(src) {
    const xorKey = 37;
    let used = false;

    src = src.replace(/"(.*?)"/g, (match, str) => {
        used = true;
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i) ^ xorKey);
        }
        return `_s({${bytes.join(",")}})`;
    });

    if (used) {
        const helper =
`local function _s(t)
    local r = ""
    for i = 1, #t do
        r = r .. string.char(t[i] ~ ${xorKey})
    end
    return r
end
`;
        src = helper + src;
    }

    return src;
}

function obfuscate() {
    let code = document.getElementById("input").value;
    if (!code.trim()) return;

    let out = minifyLua(code);
    out = encodeStringsXOR(out);

    document.getElementById("output").value = out;
}

function copyOutput() {
    const out = document.getElementById("output");
    out.select();
    document.execCommand("copy");
}
