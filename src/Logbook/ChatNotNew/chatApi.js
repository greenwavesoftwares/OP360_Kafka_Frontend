export const sendMessageToBot = async (logbookId, messages) => {
  if (typeof logbookId !== "number") {
    throw new Error(`❌ logbookId must be number, got ${typeof logbookId}: ${logbookId}`);
  }

  const res = await fetch(`${process.env.REACT_APP_MONGODBAPI}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ logbookId, messages })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Backend error: ${errText}`);
  }

  return await res.text();
};