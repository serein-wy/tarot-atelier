import assert from 'node:assert/strict';
import {deck} from '../dist/deck.js';
import {createReadingData, buildAIPrompt} from '../dist/reading.js';
for (const count of [1,3]) {
  for (const reverse of [false,true]) {
    const selected=deck.slice(7,7+count).map((c,i)=>({...c,reverse:i%2?!reverse:reverse}));
    const input={question:'  我的「新项目」\n应该如何推进？ <test>  ',theme:'事业',count,selected};
    const before=JSON.stringify(input),data=createReadingData(input),prompt=buildAIPrompt(data);
    const embedded=JSON.parse(prompt.split('【本次占卜数据】\n')[1].split('\n\n【解读要求】')[0]);
    assert.deepEqual(embedded,data);assert.equal(data.原始问题,input.question);assert.equal(data.问题主题,'事业');
    data.抽牌结果.forEach((c,i)=>{assert.equal(c.中文名称,selected[i].name);assert.equal(c.英文名称,selected[i].english);assert.equal(c.正逆位,selected[i].reverse?'逆位':'正位');assert.equal(c['传统韦特牌义（本牌库固定摘要，对应本次正逆位）'],selected[i].reverse?selected[i].reversed:selected[i].upright);assert.equal(c.牌位,count===1?'此刻的指引':['现状','阻碍','建议'][i]);});
    assert.equal(JSON.stringify(input),before,'formatting must not mutate draw');
  }
}
const empty=createReadingData({question:'',theme:'爱情',count:1,selected:[{...deck[0],reverse:false}]});assert.equal(empty.原始问题,'');assert.match(empty.问题状态,/未输入/);
console.log('PASS: 1/3 cards, both orientations, original question, positions, meanings, immutable draw, empty question');
