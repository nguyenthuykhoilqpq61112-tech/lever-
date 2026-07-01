const cloud = require('wx-server-sdk')
const https = require('https')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

function requestJson(url, apiKey, payload) {
  return new Promise((resolve, reject) => {
    const target = new URL(url)
    const body = JSON.stringify(payload)
    const request = https.request({
      hostname: target.hostname,
      port: target.port || 443,
      path: `${target.pathname}${target.search}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (response) => {
      let data = ''
      response.on('data', (chunk) => {
        data += chunk
      })
      response.on('end', () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`Model provider returned HTTP ${response.statusCode}: ${data}`))
          return
        }
        resolve(JSON.parse(data))
      })
    })

    request.on('error', reject)
    request.write(body)
    request.end()
  })
}

exports.main = async (event) => {
  const apiKey = process.env.OPENAI_API_KEY
  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini'
  const prompt = event.prompt || ''

  if (!apiKey) {
    return {
      configured: false,
      message: [
        'gaokaoSkill 云函数已收到请求，但还没有配置模型环境变量。',
        '下一步：在云函数环境变量中设置 OPENAI_API_KEY，并按需设置 OPENAI_BASE_URL、OPENAI_MODEL。',
        '当前可先复制小程序生成的 Skill Prompt 到你信任的 AI 工具或模型中分析。'
      ].join('\n')
    }
  }

  const payload = {
    model,
    messages: [
      {
        role: 'system',
        content: '你是 高考志愿咨询助手 高考志愿填报辅助 AI 工具。必须先讲边界和待核验事项，不承诺录取，不输出伪精确概率。'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.2
  }

  const response = await requestJson(`${baseUrl.replace(/\/$/, '')}/chat/completions`, apiKey, payload)
  const answer = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content

  return {
    configured: true,
    model,
    answer: answer || '模型接口未返回可展示内容。'
  }
}
