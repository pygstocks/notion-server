export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 허용돼요.' });
    return;
  }

  const { name, email, message } = req.body;

  // 여기에 본인의 Notion 정보 입력!
  const NOTION_DATABASE_ID = "256280bce33d80998ca1f38447bddadd";
  const NOTION_API_KEY = "YOUR_SECRET_API_KEY";

  const notionRes = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        이름: { title: [{ text: { content: name } }] },
        이메일: { email: email },
        메시지: { rich_text: [{ text: { content: message } }] }
      },
    }),
  });

  if (notionRes.ok) {
    res.status(200).json({ message: '저장 성공!' });
  } else {
    const error = await notionRes.text();
    res.status(500).json({ error });
  }
}
