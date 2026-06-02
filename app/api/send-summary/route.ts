import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1️⃣ プラン基本料金の計算（軽バン：15,000円 / 2tトラック：35,000円）
    const planBasePrice = data.autoPlan === "subaru" ? 15000 : 35000;
    const planName = data.autoPlan === "subaru" ? "軽バン（エブリイ）プラン" : "2tアルミトラックプラン";

    // 2️⃣ 階数・階段移動のテキスト判定（画面のセレクトボックスのvalue [2200, 4400, 6600] をそのまま使用）
    const stairsPrice = Number(data.stairs) || 0;
    let stairsText = '';

    if (stairsPrice === 0) {
      stairsText = '1階 ⇔ 1階（またはエレベーターあり） (+0円)';
    } else if (stairsPrice === 2200) {
      stairsText = '2階（階段のみ） (+2,200円)';
    } else if (stairsPrice === 4400) {
      stairsText = '3階（階段のみ） (+4,400円)';
    } else if (stairsPrice >= 6600) {
      stairsText = `4階以上（階段のみ） (+${stairsPrice.toLocaleString()}円〜)`;
    } else {
      stairsText = `階段移動あり (+${stairsPrice.toLocaleString()}円)`;
    }

    // 3️⃣ 各種オプション料金（使っていない無料特典の変数宣言を削除して警告をクリア！）
    const noVehicleAccessPrice = data.noVehicleAccess ? 3300 : 0;
    const addWorkerPrice = data.addWorker ? 11000 : 0;

    // 💡 届くメールの本文を組み立て
    const emailHtml = `
      <h2>【A.P.C LOGISTICS 単身引越しLP】新しい見積もりシミュレーション（予約番号発行）がありました！</h2>
      <p><strong>予約番号：</strong> #${data.bookingNumber}</p>
      <hr />
      
      <h3>■ 料金合計</h3>
      <p style="font-size: 18px; color: #ff0000;">
        <strong>概算合計金額： ${data.totalPrice.toLocaleString()} 円（税込）</strong>
      </p>
      
      <hr />
      
      <h3>■ 見積もり・料金内訳</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px 0;"><strong>確定プラン基本料金：</strong></td>
          <td style="padding: 8px 0; text-align: right;">${planName} (${planBasePrice.toLocaleString()}円)</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px 0;"><strong>建物の階数・階段移動：</strong></td>
          <td style="padding: 8px 0; text-align: right;"><strong>${stairsText}</strong></td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px 0;"><strong>トラック進入不可（横持ち）：</strong></td>
          <td style="padding: 8px 0; text-align: right;">${data.noVehicleAccess ? `✅ あり (+${noVehicleAccessPrice.toLocaleString()}円)` : '❌ なし (+0円)'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px 0;"><strong>作業員1名追加：</strong></td>
          <td style="padding: 8px 0; text-align: right;">${data.addWorker ? `✅ あり (+${addWorkerPrice.toLocaleString()}円)` : '❌ なし (+0円)'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px 0;"><strong>プレミアム特典①（Wi-Fi・PC設定）：</strong></td>
          <td style="padding: 8px 0; text-align: right;">${data.pcSetup ? '✅ 希望する (0円)' : '❌ なし'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #ddd;">
          <td style="padding: 8px 0;"><strong>プレミアム特典②（不用品丸ごと査定）：</strong></td>
          <td style="padding: 8px 0; text-align: right;">${data.purchaseOption ? '✅ 希望する (0円)' : '❌ なし'}</td>
        </tr>
      </table>

      <h3>■ その他情報</h3>
      <ul>
        <li><strong>選択ルート：</strong> ${data.selectedRoute || '（未選択・カスタム入力）'}</li>
        ${data.customDistance ? `<li><strong>カスタム走行距離：</strong> ${data.customDistance} km</li>` : ''}
      </ul>

      <h3>■ お荷物の目安</h3>
      <ul>
        <li><strong>ダンボール：</strong> ${data.boxCount} 箱</li>
        <li><strong>冷蔵庫：</strong> ${data.hasFridge ? '✅ あり' : '❌ なし'}</li>
        <li><strong>洗濯機：</strong> ${data.hasWashing ? '✅ あり' : '❌ なし'}</li>
        <li><strong>ベッド：</strong> ${data.hasBed ? '✅ あり' : '❌ なし'}</li>
        <li><strong>布団：</strong> ${data.hasFuton ? '✅ あり' : '❌ なし'}</li>
      </ul>
      
      <hr />
      <p>※このメールはシミュレーターで「予約番号を発行する」が押された際に自動送信されました。</p>
    `;
    
    console.log("API Key loaded:", process.env.RESEND_API_KEY ? "Yes" : "No");
    // 直書きしていた部分を以下に変更
    const resendApiKey = process.env.RESEND_API_KEY;

    // 送信処理
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'A.P.C LOGISTICS <onboarding@resend.dev>',
        to: 'airyu011005@outlook.jp',
        subject: `【予約番号 #${data.bookingNumber}】単身引越し概算見積もり通知`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resend API Error:', errorText);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mail API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}