let device, server, outputReport;

// 音階の振動データ（簡易的な設定）
const notes = {
    'C': [100, 200],
    'D': [120, 220],
    'E': [140, 240],
    'F': [160, 260],
    'G': [180, 280],
    'A': [200, 300],
    'B': [220, 320],
    'C2': [240, 340]
};

// Joy-Conと接続
async function connectJoyCon() {
    try {
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service', 0x180F]
        });

        server = await device.gatt.connect();
        console.log("Joy-Con connected:", device.name);

        alert("接続成功！音階ボタンを押して振動させてください。");

        // 音階ボタンを生成
        createNoteButtons();
    } catch (error) {
        console.error("接続失敗:", error);
        alert("接続に失敗しました。");
    }
}

// 音階ボタンの作成
function createNoteButtons() {
    const container = document.getElementById("buttons");
    container.innerHTML = ""; // 既存のボタンを削除

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
        alert("Joy-Conが接続されていません！");
        return;
    }

    let pattern = notes[note] || [100, 200];

    console.log(`Vibrating at ${pattern[0]}Hz and ${pattern[1]}Hz`);

    // 実際にJoy-Conへ振動コマンドを送るにはHIDプロトコルが必要
    alert(`${note} の振動！（仮実装）`);
}
