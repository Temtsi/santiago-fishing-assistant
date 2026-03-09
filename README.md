# Santiago Fishing Assistant

Это версия с реальным AI через backend (не локальные шаблоны).

## 1) Подготовка

1. Установи Node.js 18+.
2. В папке проекта задай ключ OpenAI:

```powershell
$env:OPENAI_API_KEY="твoй_ключ"
```

## 2) Запуск

```powershell
cd C:\Users\User\Documents\Playground\fishing-assistant-prototype
npm start
```

Открой: `http://localhost:8787`

## 3) Включение AI в интерфейсе

На странице **Ассистент**:
1. Включи `ИИ-советы в чате`.
2. В поле backend URL укажи `http://localhost:8787/api/ai`.
3. Нажми `Сохранить ИИ`.

## 4) GitHub

Можно пушить проект как есть. На сервере/хостинге нужен env:
- `OPENAI_API_KEY`
- `PORT` (опционально)
- `OPENAI_MODEL` (опционально)

## Knowledge Pipeline

- `npm run fishbase:sync` - fetch FishBase data and build:
  - `data/fishbase-raw-cache.json`
  - `data/knowledge-base.rag.json`
- `npm run knowledge:validate` - validate built KB (required fields, duplicates, mojibake check)
- `npm run knowledge:build` - run sync with automatic fallback to previous cache + validate

Targets are configured in `data/fishbase-targets.json`.

