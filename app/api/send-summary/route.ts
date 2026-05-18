import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1️⃣ プラン基本料金の計算とテキスト化
    const planBasePrice = data.autoPlan === "subaru" ? 15000 : 35000;
    const planName = data.autoPlan === "subaru" ? "軽バン（エブリイ）プラン" : "2tアルミトラックプラン";

    // 2️⃣ 階数・階段移動の翻訳と料金計算 (1階ごとに+3,000円)
    let stairsText = '';
    const stairsPrice = (data.stairs || 0) * 3000;
    if (!data.stairs || data.stairs === 0 || data.stairs === "0") {
      stairsText = 'エレベーターあり（または1階階段なし） (+0円)';
    } else {
      stairsText = `階段移動あり（${data.stairs} 階分） (+${stairsPrice.toLocaleString()}円)`;
    }

    // 3️⃣ 各種オプション料金の計算
    const noVehicleAccessPrice = data.noVehicleAccess ? 5000 : 0;
    const addWorkerPrice = data.addWorker ? 12000 : 0;
    const pcSetupPrice = data.pcSetup ? 3000 : 0;

    // 💡 届くメールの本文を組み立て（内訳を美しくレイアウトしました）
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
          <td style="padding: 8px 0; text-align: right;">${stairsText}</td>
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
          <td style="padding: 8px 0;"><strong>PC・周辺機器配線設置：</strong></td>
          <td style="padding: 8px 0; text-align: right;">${data.pcSetup ? `✅ あり (+${pcSetupPrice.toLocaleString()}円)` : '❌ なし (+0円)'}</td>
        </tr>
      </table>

      <h3>■ その他情報</h3>
      <ul>
        <li><strong>選択ルート：</strong> ${data.selectedRoute || '（未選択・カスタム入力）'}</li>
        ${data.customDistance ? `<li><strong>カスタム走行距離：</strong> ${data.customDistance} km</li>` : ''}
        <li><strong>不要品買取・引取査定：</strong> ${data.purchaseOption ? '✅ 希望する' : '❌ 希望しない'}</li>
      </ul>

      <h3>■ お荷物の目安</h3>
      <ul>
        <li>ダンボール： ${data.boxCount} 箱</li>
        <li>冷蔵庫： ${data.hasFridge ? '✅ あり' : '❌ なし'}</li>
        <li>洗濯機： ${data.hasWashing ? '✅ あり' : '❌ なし'}</li>
        <li>ベッド： ${data.hasBed ? '✅ あり' : '❌ なし'}</li>
        <li>布団： ${data.hasFuton ? '✅ あり' : '❌ なし'}</li>
      </ul>
      
      <hr />
      <p>※このメールはシミュレーターで「予約番号を発行する」が押された際に自動送信されました。</p>
    `;

    // 💡 APIキーの宣言
    const resendApiKey = 're_X4r7hgtU_9CjP7CqX11NXoH8CjjLx7P6J';

    // 💡 送信処理を実行
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