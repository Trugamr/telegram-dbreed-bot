const dbree = require('./dbree');
const telegraf = require('telegraf');

const bot = new telegraf(process.env.TG_BOT_KEY);

const types = ['MPEG-4 Audio', 'MPEG Audio', 'MP3 Audio', 'FLAC Audio'];

//causing erorr -  dont let me down daya

bot.start(ctx => { ctx.reply('Sup...') });
bot.command('ping', ctx => { ctx.reply('pong :/')});
bot.on('inline_query', ctx => {
    console.log(ctx.from.username, ":", ctx.inlineQuery.query);
    dbree.searchInfo(ctx.inlineQuery.query, types)
    .then(data => data.filter(music => music.name != 'NA'))
    .then(data => data.map((music, index) => (
        {
            type: 'article',
            id: index,
            title: music.name,
            // input_message_content: { message_text: music.url },
            input_message_content: {
                message_text: `*${music.name}* (${music.year})
_by ${music.artist}_
${music.album}
${music.type} | ${music.size} | ${music.bitrate}kbps
[Download](${music.url})`,
                parse_mode: 'markdown',
                disable_web_page_preview: false
            },
            url: music.url,
            hide_url: true,
            description: `by ${music.artist} (${music.year}) | ${music.size} (${music.bitrate}kbps) | ${music.type}`,
            thumb_url: music.art
        }
    )))
    .then(result => {
        ctx.answerInlineQuery(result)
    })
    .catch(err => { console.error(Error(err)) });    
})
bot.startPolling();
console.log('Polling...');








// dbree.searchInfo('This feeling chainsmokers', types)
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => { console.error(Error(err)) });