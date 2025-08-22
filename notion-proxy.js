export default async function handler(req, res) {
  // CORS 허용 헤더 추가
  res.setHeader('Access-Control-Allow-Origin', '*'); // 보안을 위해 필요한 도메인만 허용 가능(ex: 'https://pygstocks.imweb.me')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 메서드(프리플라이트 요청) 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST 요청만 허용돼요.' });
    return;
  }

  const { name, email, message } = req.body;

  const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  try {
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
