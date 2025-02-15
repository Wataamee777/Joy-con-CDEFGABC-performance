let device = null; // Joy-Conのデバイス情報
let server = null;
let controlCharacteristic = null; // 振動用のCharacteristic

const notes = {
    'C': [100, 200], 'D': [120, 220], 'E': [140, 240], 'F': [160, 260],
    'G': [180, 280], 'A': [200, 300], 'B': [220, 320], 'C2': [240, 340]
};

// 🔹【スクリプト実行時にボタンを生成】🔹
createNoteButtons();

// Joy-ConをBluetooth接続
async function connectJoyCon() {
    try {
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [0x0100] // Joy-ConのHIDサービス
        });

        server = await device.gatt.connect();
        const service = await server.getPrimaryService(0x0100);
        controlCharacteristic = await service.getCharacteristic(0x0101);

        console.log("Joy-Con connected:", device.name);
        alert("接続成功！ボタンを押して振動を試してください。");

    } catch (error) {
        console.error("接続失敗:", error);
        alert("接続に失敗しました：" + error.message);
    }
}

// 音階ボタンを作成
function createNoteButtons() {
    const container = document.getElementById("buttons");
    container.innerHTML = ""; // 既存のボタンを削除（再生成用）

    Object.keys(notes).forEach(note => {
        const btn = document.createElement("button");
        btn.innerText = note;
        btn.onclick = () => vibrateJoyCon(note);
        container.appendChild(btn);
    });
}

// Joy-Conを振動させる
async function vibrateJoyCon(note) {
    if (!controlCharacteristic) {
        alert(`${note} の振動！（Joy-Con未接続のため仮実装）`);
        return;
    }

    let intensity = notes[note][0]; // 簡単な振動強度の設定
    let command = new Uint8Array([
        0x10, 0x00, 0x01, 0x40, 0x40, 0x00, 0x01, 0x40, 0x40, // 振動コマンド
        intensity & 0xFF, (intensity >> 8) & 0xFF, 0, 0, 0, 0
    ]);

    try {
        await controlCharacteristic.writeValue(command);
        console.log(`Vibrating at intensity ${intensity}`);
    } catch (error) {
        console.error("振動エラー:", error);
        alert("振動に失敗しました：" + error.message);
    }
}
