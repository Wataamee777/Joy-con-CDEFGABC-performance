let device = null; 
let server = null;
let controlCharacteristic = null;

const notes = {
    'C': 100, 'D': 120, 'E': 140, 'F': 160,
    'G': 180, 'A': 200, 'B': 220
};

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
        alert("接続成功！音階ボタンを押して振動を試してください。");

        // ボタン作成
        createNoteButtons();

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

    let intensity = notes[note]; // 音階に応じた振動強度
    let command = new Uint8Array([
        0x10, 0x00, 0x01, 0x40, 0x40, 0x00, 0x01, 0x40, 0x40, // 振動コマンド
        intensity & 0xFF, (intensity >> 8) & 0xFF, 0, 0, 0, 0
    ]);

    try {
        await controlCharacteristic.writeValue(command);
        console.log(`${note}の音階で振動を開始しました (強度: ${intensity})`);
    } catch (error) {
        console.error("振動エラー:", error);
        alert("振動に失敗しました：" + error.message);
    }
}
