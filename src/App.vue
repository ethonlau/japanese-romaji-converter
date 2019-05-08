<template>
  <div id="app">
    <textarea v-model="content" placeholder="Convert Janpanese to Romaji" type="text"></textarea>
    <button @click="converte"
            class="btn-convert"
            :class="{ 'no-content': !content, 'cleanup': result }">
      <template v-if="result">Back</template>
      <template v-else>Let's go</template>
    </button>
    <div v-if="loading" class="loader"></div>
    <div v-if="errored" class="error">😯Something wrong</div>
    <div v-if="result" class="result">
      <template v-for="(item, index) in result">
        <span v-if="!item.Surface.length" :key="index"></span>
        <template v-else-if="item.Surface.toString().indexOf('|') === 0">
          <br :key="index">
          <ruby v-if="item.Surface.length > 1" class="word" :key="index">
            <rt class="furigana"></rt>
            {{item.Surface.replace('|','')}}
            <rt class="roman"></rt>
          </ruby>
        </template>
        <ruby v-else class="word" :key="index">
          <rt class="furigana">{{item.Furigana}}</rt>
          {{item.Surface}}
          <rt v-if="item.Roman" class="roman">{{item.Roman}}</rt>
          <rt v-else class="roman">{{kana(item.Surface)}}</rt>
        </ruby>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'app',
  data() {
    return {
      loading: false,
      errored: false,
      content: '',
      result: null,
    }
  },
  methods: {
    converte () {
      if (this.result) {
        this.result = null
      } else {
        this.errored = false
        this.loading = true
        const sentence = this.content.replace(/\n/g, "|")
        const proxyurl = "https://cors-anywhere.herokuapp.com/"
        const url = `https://jlp.yahooapis.jp/FuriganaService/V1/furigana?appid=dj00aiZpPUM1Y2pQYlpqcERldyZzPWNvbnN1bWVyc2VjcmV0Jng9ZGM-&grade=1&sentence=${sentence}`
        axios
          .get(proxyurl+url)
          .then(response => {
            let DOMParser = require('xmldom').DOMParser
            let result = new DOMParser().parseFromString(response.data.replace(/\s/g, ""), 'text/xml');
            let resJson = this.xmlToJson(result)
            this.result = resJson.Result.WordList.Word
          })
          .catch(() => {
            this.errored = true
            setTimeout(() => {
              this.errored = false
            }, 1000)
          })
          .finally(() => this.loading = false)
      }
    },
    xmlToJson (xml) {
      let obj = {};
      if (xml.nodeType === 1) {
        if (xml.attributes.length > 0) {
          obj['@attributes'] = {};
          for (let j = 0; j < xml.attributes.length; j += 1) {
            const attribute = xml.attributes.item(j);
            obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
          }
        }
      } else if (xml.nodeType === 3) {
        obj = xml.nodeValue;
      }
      if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
        obj = xml.childNodes[0].nodeValue;
      } else if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i += 1) {
          const item = xml.childNodes.item(i);
          const nodeName = item.nodeName;
          if (typeof (obj[nodeName]) === 'undefined') {
            obj[nodeName] = this.xmlToJson(item);
          } else {
            if (typeof (obj[nodeName].push) === 'undefined') {
              const old = obj[nodeName];
              obj[nodeName] = [];
              obj[nodeName].push(old);
            }
            obj[nodeName].push(this.xmlToJson(item));
          }
        }
      }
      return obj;
    },
    kana (text) {
      const u = text.match(/[\u3040-\u3f9f]+/g)
      if (u) {
        return u[0].replace(/んま/g,"mma").replace(/んみ/g,"mmi").replace(/んむ/g,"mmu").replace(/んめ/g,"mme").replace(/んも/g,"mmo").replace(/んば/g,"mba").replace(/んび/g,"mbi").replace(/んぶ/g,"mbu").replace(/んべ/g,"mbe").replace(/んぼ/g,"mbo").replace(/んぱ/g,"mpa").replace(/んぴ/g,"mpi").replace(/んぷ/g,"mpu").replace(/んぺ/g,"mpe").replace(/んぽ/g,"mpo").replace(/んあ/g,"nga").replace(/んい/g,"ngi").replace(/んう/g,"ngu").replace(/んえ/g,"nge").replace(/んお/g,"ngo").replace(/んか/g,"ngka").replace(/んき/g,"ngki").replace(/んく/g,"ngku").replace(/んけ/g,"ngke").replace(/んこ/g,"ngko").replace(/んは/g,"ngha").replace(/んひ/g,"nghi").replace(/んふ/g,"nghu").replace(/んへ/g,"nghe").replace(/んほ/g,"ngho").replace(/んや/g,"ngya").replace(/んい/g,"ngi").replace(/んゆ/g,"ngyu").replace(/んえ/g,"nge").replace(/んよ/g,"ngyo").replace(/んわ/g,"ngwa").replace(/んい/g,"ngi").replace(/んう/g,"ngu").replace(/んえ/g,"nge").replace(/んを/g,"ngwo").replace(/んが/g,"ngga").replace(/んぎ/g,"nggi").replace(/んぐ/g,"nggu").replace(/んげ/g,"ngge").replace(/んご/g,"nggo").replace(/あ/g,"a").replace(/い/g,"i").replace(/う/g,"u").replace(/え/g,"e").replace(/お/g,"o").replace(/や/g,"ya").replace(/ゆ/g,"yu").replace(/よ/g,"yo").replace(/か/g,"ka").replace(/き/g,"ki").replace(/く/g,"ku").replace(/け/g,"ke").replace(/こ/g,"ko").replace(/きゃ/g,"kya").replace(/きゅ/g,"kyu").replace(/きょ/g,"kyo").replace(/さ/g,"sa").replace(/し/g,"shi").replace(/す/g,"su").replace(/せ/g,"se").replace(/そ/g,"so").replace(/しゃ/g,"sha").replace(/しゅ/g,"shu").replace(/しょ/g,"sho").replace(/た/g,"ta").replace(/ち/g,"chi").replace(/つ/g,"tsu").replace(/て/g,"te").replace(/と/g,"to").replace(/ちゃ/g,"cha").replace(/ちゅ/g,"chu").replace(/ちょ/g,"cho").replace(/な/g,"na").replace(/に/g,"ni").replace(/ぬ/g,"nu").replace(/ね/g,"ne").replace(/の/g,"no").replace(/にゃ/g,"nya").replace(/にゅ/g,"nyu").replace(/にょ/g,"nyo").replace(/は/g,"ha").replace(/ひ/g,"hi").replace(/ふ/g,"fu").replace(/へ/g,"he").replace(/ほ/g,"ho").replace(/ひゃ/g,"hya").replace(/ひゅ/g,"hyu").replace(/ひょ/g,"hyo").replace(/ま/g,"ma").replace(/み/g,"mi").replace(/む/g,"mu").replace(/め/g,"me").replace(/も/g,"mo").replace(/みゃ/g,"mya").replace(/みゅ/g,"myu").replace(/みょ/g,"myo").replace(/や/g,"ya").replace(/ゆ/g,"yu").replace(/よ/g,"yo").replace(/ら/g,"ra").replace(/り/g,"ri").replace(/る/g,"ru").replace(/れ/g,"re").replace(/ろ/g,"ro").replace(/りゃ/g,"rya").replace(/りゅ/g,"ryu").replace(/りょ/g,"ryo").replace(/わ/g,"wa").replace(/ゐ/g,"i").replace(/ゑ/g,"e").replace(/を/g,"o").replace(/ん/g,"n").replace(/が/g,"ga").replace(/ぎ/g,"gi").replace(/ぐ/g,"gu").replace(/げ/g,"ge").replace(/ご/g,"go").replace(/ぎゃ/g,"gya").replace(/ぎゅ/g,"gyu").replace(/ぎょ/g,"gyo").replace(/ざ/g,"za").replace(/じ/g,"ji").replace(/ず/g,"zu").replace(/ぜ/g,"ze").replace(/ぞ/g,"zo").replace(/じゃ/g,"ja").replace(/じゅ/g,"ju").replace(/じょ/g,"jo").replace(/だ/g,"da").replace(/ぢ/g,"ji").replace(/づ/g,"zu").replace(/で/g,"de").replace(/ど/g,"do").replace(/ぢゃ/g,"ja").replace(/ぢゅ/g,"ju").replace(/ぢょ/g,"jo").replace(/ば/g,"ba").replace(/び/g,"bi").replace(/ぶ/g,"bu").replace(/べ/g,"be").replace(/ぼ/g,"bo").replace(/びゃ/g,"bya").replace(/びゅ/g,"byu").replace(/びょ/g,"byo").replace(/ぱ/g,"pa").replace(/ぴ/g,"pi").replace(/ぷ/g,"pu").replace(/ぺ/g,"pe").replace(/ぽ/g,"po").replace(/ぴゃ/g,"pya").replace(/ぴゅ/g,"pyu").replace(/ぴょ/g,"pyo").replace(/ア/g,"a").replace(/イ/g,"i").replace(/ウ/g,"u").replace(/エ/g,"e").replace(/オ/g,"o").replace(/ャ/g,"ya").replace(/ュ/g,"yu").replace(/ョ/g,"yo").replace(/カ/g,"ka").replace(/キ/g,"ki").replace(/ク/g,"ku").replace(/ケ/g,"ke").replace(/コ/g,"ko").replace(/キャ/g,"kya").replace(/キュ/g,"kyu").replace(/キョ/g,"kyo").replace(/サ/g,"sa").replace(/シ/g,"shi").replace(/ス/g,"su").replace(/セ/g,"se").replace(/ソ/g,"so").replace(/シャ/g,"sha").replace(/シュ/g,"shu").replace(/ショ/g,"sho").replace(/タ/g,"ta").replace(/チ/g,"chi").replace(/ツ/g,"tsu").replace(/テ/g,"te").replace(/ト/g,"to").replace(/チャ/g,"cha").replace(/チュ/g,"chu").replace(/チョ/g,"cho").replace(/ナ/g,"na").replace(/ニ/g,"ni").replace(/ヌ/g,"nu").replace(/ネ/g,"ne").replace(/ノ/g,"no").replace(/ニャ/g,"nya").replace(/ニュ/g,"nyu").replace(/ニョ/g,"nyo").replace(/ハ/g,"ha").replace(/ヒ/g,"hi").replace(/フ/g,"fu").replace(/ヘ/g,"he").replace(/ホ/g,"ho").replace(/ヒャ/g,"hya").replace(/ヒュ/g,"hyu").replace(/ヒョ/g,"hyo").replace(/マ/g,"ma").replace(/ミ/g,"mi").replace(/ム/g,"mu").replace(/メ/g,"me").replace(/モ/g,"mo").replace(/ミャ/g,"mya").replace(/ミュ/g,"myu").replace(/ミョ/g,"myo").replace(/ヤ/g,"ya").replace(/ユ/g,"yu").replace(/ヨ/g,"yo").replace(/ラ/g,"ra").replace(/リ/g,"ri").replace(/ル/g,"ru").replace(/レ/g,"re").replace(/ロ/g,"ro").replace(/リャ/g,"rya").replace(/リュ/g,"ryu").replace(/リョ/g,"ryo").replace(/ワ/g,"wa").replace(/ヰ/g,"i").replace(/ヱ/g,"e").replace(/ヲ/g,"o").replace(/ン/g,"n").replace(/ガ/g,"ga").replace(/ギ/g,"gi").replace(/グ/g,"gu").replace(/ゲ/g,"ge").replace(/ゴ/g,"go").replace(/ギャ/g,"gya").replace(/ギュ/g,"gyu").replace(/ギョ/g,"gyo").replace(/ザ/g,"za").replace(/ジ/g,"ji").replace(/ズ/g,"zu").replace(/ゼ/g,"ze").replace(/ゾ/g,"zo").replace(/ジャ/g,"ja").replace(/ジュ/g,"ju").replace(/ジョ/g,"jo").replace(/ダ/g,"da").replace(/ヂ/g,"ji").replace(/ヅ/g,"zu").replace(/デ/g,"de").replace(/ド/g,"do").replace(/ヂャ/g,"ja").replace(/ヂュ/g,"ju").replace(/ヂョ/g,"jo").replace(/バ/g,"ba").replace(/ビ/g,"bi").replace(/ブ/g,"bu").replace(/ベ/g,"be").replace(/ボ/g,"bo").replace(/ビャ/g,"bya").replace(/ビュ/g,"byu").replace(/ビョ/g,"byo").replace(/パ/g,"pa").replace(/ピ/g,"pi").replace(/プ/g,"pu").replace(/ペ/g,"pe").replace(/ポ/g,"po").replace(/ピャ/g,"pya").replace(/ピュ/g,"pyu").replace(/ピョ/g,"pyo").replace(/ー/g,"-").replace(/ヴ/g,"v").replace(/ぁ/g,"a").replace(/ぃ/g,"i").replace(/ぅ/g,"u").replace(/ぇ/g,"e").replace(/ぉ/g,"o").replace(/ゃ/g,"ya").replace(/ゅ/g,"yu").replace(/ょ/g,"yo").replace(/ゎ/g,"wa").replace(/ゕ/g,"ka").replace(/ゖ/g,"ke").replace(/ァ/g,"a").replace(/ィ/g,"i").replace(/ゥ/g,"u").replace(/ェ/g,"e").replace(/ォ/g,"o").replace(/ャ/g,"ya").replace(/ュ/g,"yu").replace(/ョ/g,"yo").replace(/ヮ/g,"wa").replace(/ヵ/g,"ka").replace(/ヶ/g,"ke").replace(/っ/g,"tsu").replace(/ッ/g,"tsu")
      }
    },
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow: hidden;

  textarea {
    border: none;
    text-align: center;
    font-size: 24px;
    width: 100vw;
    padding: 30vh 0 100px 0;
    height: calc(70vh - 100px);
    line-height: 2;
    color: #2c3e50;
    outline: none;
    resize: none;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .btn-convert {
    position: absolute;
    bottom: 30px;
    right: 50%;
    transform: translateX(50%);
    padding: 10px 0;
    border-radius: 40px;
    border: none;
    width: 200px;
    font-size: 16px;
    font-weight: bold;
    background-color: #38f;
    color: white;
    cursor: pointer;
    outline: none;
    box-shadow: 0 10px 10px #3388ff29;
    z-index: 1;
    transition: .5s;

    &:hover {
      background-color: #39f;
    }

    &.no-content {
      opacity: .4;
      pointer-events: none;
    }

    &.cleanup {
      right: 30px;
      width: 60px;
      transform: none;
    }
  }

  .result {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: white;
    overflow-y: scroll;
    padding: 30vh 0 100px 0;

    .word {
      display: inline-block;
      position: relative;
      font-size: 24px;
      line-height: 1.2;
      margin: 12px 3px;
      vertical-align: middle;
    }

    rt {
      min-height: 12px;
      font-size: 12px;
      line-height: 1;
    }
  }

  .loader, .error {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255,255,255,0.7);
    z-index: 2;
  }

  .error {
    line-height: 100vh;
  }

  .loader {
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      margin: -10px 0 0 -10px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid #38f;
      border-top-color: transparent;
      animation: rolling 1s infinite linear;
    }

    @keyframes rolling {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
}
</style>
