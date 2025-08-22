export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 허용돼요.' });
    return;
  }

  const { name, email, message } = req.body;

  // 환경 변수에서 불러오기
  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

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
