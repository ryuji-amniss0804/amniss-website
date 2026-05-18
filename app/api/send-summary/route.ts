import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 💡 Resend用のAPIキー設定（本番公開時にVercel側でセットします）
    const resendApiKey = process.env.RESEND_API_KEY || 're_mock_key';

    // 届くメールの本文を組み立て
    const emailHtml = `
      <h2>【DWPC 単身引越しLP】新しい見積もりシミュレーション（予約番号発行）がありました！</h2>
      <p><strong>予約番号：</strong> #${data.bookingNumber}</p>
      <hr />
      <h3>■ 見積もり内容</h3>
      <p><strong>確定プラン：</strong> ${data.autoPlan === "subaru" ? "軽バン（エブリイ）プラン" : "2tアルミトラックプラン"}</p>
      <p><strong>概算合計金額：</strong> ${data.totalPrice.toLocaleString()} 円（税込）</p>
      <p><strong>選択ルート：</strong> ${data.selectedRoute || '（未選択・カスタム入力）'}</p>
      ${data.customDistance ? `<p><strong>カスタム走行距離：</strong> ${data.customDistance} km</p>` : ''}
      
      <h3>■ お荷物の目安</h3>
      <ul>
        <li>ダンボール： ${data.boxCount} 箱</li>
        <li>冷蔵庫： ${data.hasFridge ? '✅ あり' : '❌ なし'}</li>
        <li>洗濯機： ${data.hasWashing ? '✅ あり' : '❌ なし'}</li>
        <li>ベッド： ${data.hasBed ? '✅ あり' : '❌ なし'}</li>
        <li>布団： ${data.hasFuton ? '✅ あり' : '❌ なし'}</li>
      </ul>

      <h3>■ 選択オプション</h3>
      <ul>
        <li>建物の階数・階段移動： ${data.stairs} 階分</li>
        <li>トラック進入不可（横持ち）： ${data.noVehicleAccess ? '✅ あり' : '❌ なし'}</li>
        <li>作業員1名追加： ${data.addWorker ? '✅ あり' : '❌ なし'}</li>
        <li>PC・周辺機器配線設置： ${data.pcSetup ? '✅ あり' : '❌ なし'}</li>
        <li>不要品買取・引取査定： ${data.purchaseOption ? '✅ あり' : '❌ なし'}</li>
      </ul>
      <hr />
      <p>※このメールはシミュレーターで「予約番号を発行する」が押された際に自動送信されました。</p>
    `;

    // 💡 エラーの原因だった箇所を完全に美しく修正しました
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'DWPC Moving Simulator <onboarding@resend.dev>',
        to: 'airyu011005@outlook.jp', // 👈 アドレスの設定完了！
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