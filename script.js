let device = null; // Joy-Conのデバイス情報
const notes = {
    'C': [100, 200], 'D': [120, 220], 'E': [140, 240], 'F': [160, 260],
    'G': [180, 280], 'A': [200, 300], 'B': [220, 320], 'C2': [240, 340]
};

// 🔹【最初から音階ボタンを表示する】🔹
document.addEventListener("DOMContentLoaded", () => createNoteButtons());

// Joy-ConをBluetooth接続
async function connectJoyCon() {
    try {
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true // optionalServices を削除
        });

        console.log("Joy-Con connected:", device.name);
        alert("接続成功！ボタンを押してみてください。");

    } catch (error) {
        console.error("接続失敗:", error);
        alert("接続に失敗しました：" + error.message);
    }
}

// 音階ボタンを作成
function createNoteButtons() {
    const container = document.getElementById("buttons");
    Object.keys(notes).forEach(note => {
        const btn = document.createElement("button");
        btn.innerText = note;
        btn.onclick = () => vibrateJoyCon(note);
        container.appendChild(btn);
    });
}

// Joy-Conを振動させる（仮）
async function vibrateJoyCon(note) {
    if (!device) {
        alert(`${note} の振動！（Joy-Con未接続のため仮実装）`);
        return;
    }

    console.log(`Vibrating at ${notes[note][0]}Hz and ${notes[note][1]}Hz`);
    alert(`${note} の振動！（実際の振動制御は未実装）`);
}
