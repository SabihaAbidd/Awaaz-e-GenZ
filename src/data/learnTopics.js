export const LEARN_FILTERS = ['All', 'Rights', 'Government', 'Elections', 'Law', 'Budget', 'Participation']

export const LEARN_TOPICS = [
  {
    id: 'voter-registration',
    emoji: '🗳️',
    bg: '#ff2d7a',
    tag: 'Elections',
    filter: 'Elections',
    category: 'Elections',
    title: 'How to Register as a Voter — Step by Step',
    excerpt:
      "Turning 18 soon? Here's everything you need to know about getting on the voters list — NADRA, NICOP, and what to do if your address changed.",
    summary:
      'Voter registration is the process that puts your name on the electoral roll so you can legally vote in elections in Pakistan.',
    readTime: '3 min read',
    fallback: {
      english: {
        simpleExplanation:
          'To vote in Pakistan, your name needs to be on the voter list. This usually connects with your CNIC and your registered address, so your voting area is linked to where you officially live.',
        whyItMatters:
          'If you are not registered correctly, you may miss the chance to vote even after turning 18.',
        realLifeExample:
          'If your family moves to another city and your CNIC address is not updated, your vote may still be attached to the old area.',
        oneSmallAction:
          'Check your voter status through official election tools and make sure your CNIC details are current.',
      },
      romanUrdu: {
        simpleExplanation:
          'Vote dene ke liye aap ka naam voter list mein hona zaroori hota hai. Yeh aam tor par aap ke CNIC aur registered address se link hota hai.',
        whyItMatters:
          'Agar registration theek na ho to 18 saal ke baad bhi aap vote dene se reh sakte hain.',
        realLifeExample:
          'Agar aap ka address change ho gaya ho lekin CNIC update na hua ho, to aap ka vote purane halqe mein dikh sakta hai.',
        oneSmallAction:
          'Official election source se apni voter details check karein aur CNIC ka address sahi rakhein.',
      },
    },
  },
  {
    id: 'fundamental-rights',
    emoji: '⚖️',
    bg: '#ff6b47',
    tag: 'Rights',
    filter: 'Rights',
    category: 'Rights',
    title: "Your Fundamental Rights — Explained Like You're 17",
    excerpt:
      "The Constitution gives you rights you've probably never heard of. Article 9 to 28 broken down — no law school required.",
    summary:
      'Fundamental rights are the basic protections the Constitution gives people, such as equality, dignity, freedom, and fair treatment under law.',
    readTime: '5 min read',
    fallback: {
      english: {
        simpleExplanation:
          'Fundamental rights are the basic rights protected by the Constitution. They include things like equality, freedom of expression, protection of dignity, and access to education in certain cases.',
        whyItMatters:
          'These rights shape how the state and public institutions should treat you in everyday life.',
        realLifeExample:
          'If someone is treated unfairly because of identity, religion, or background, rights-based protections become relevant.',
        oneSmallAction:
          'Learn one right that directly affects your life, such as education or freedom of expression, and read its official wording.',
      },
      romanUrdu: {
        simpleExplanation:
          'Bunyadi haqooq woh asasi haq hain jo Constitution aap ko deta hai, jaise barabari, izzat, azaadi-e-rae aur qanooni tahaffuz.',
        whyItMatters:
          'Yeh haqooq is baat ko shape karte hain ke state aur idaray aap ke saath kaisa rawayya rakhein.',
        realLifeExample:
          'Agar kisi ke saath mazhab, background ya pehchan ki bunyad par na-insafi ho, to bunyadi haqooq aham ho jate hain.',
        oneSmallAction:
          'Aaj ek bunyadi haq choose karein aur us ka official matn parh kar samjhein.',
      },
    },
  },
  {
    id: 'national-assembly-vs-senate',
    emoji: '🏛️',
    bg: '#ff9c2a',
    tag: 'Government',
    filter: 'Government',
    category: 'Government',
    title: "National Assembly vs Senate — What's the Difference?",
    excerpt:
      "Two houses, one parliament. Why do we need both? Who has more power? And why does it matter for you? Let's break it down.",
    summary:
      'Pakistan’s Parliament has two houses: the National Assembly and the Senate. They both take part in lawmaking, but they are structured differently.',
    readTime: '4 min read',
    fallback: {
      english: {
        simpleExplanation:
          'The National Assembly is more directly tied to population-based representation, while the Senate gives provinces equal representation. Together, they help make laws at the federal level.',
        whyItMatters:
          'This structure is meant to balance majority representation with provincial voice.',
        realLifeExample:
          'A large province may have more seats in the National Assembly, but the Senate helps smaller provinces still have a strong say.',
        oneSmallAction:
          'Look up how many seats your province has in each house and compare the difference.',
      },
      romanUrdu: {
        simpleExplanation:
          'National Assembly zyada tar awaam ki abadi ki bunyad par representation deti hai, jab ke Senate soobon ko barabar awaaz dene ke liye hota hai. Dono mil kar federal qanoon sazi mein hissa lete hain.',
        whyItMatters:
          'Is se majority ki representation aur soobai awaaz ke darmiyan balance banane ki koshish hoti hai.',
        realLifeExample:
          'Bara sooba National Assembly mein zyada seats rakh sakta hai, lekin Senate chhote soobon ko bhi barabar awaaz deta hai.',
        oneSmallAction:
          'Apne soobay ki National Assembly aur Senate representation compare karke dekhein.',
      },
    },
  },
  {
    id: 'right-to-information',
    emoji: '📋',
    bg: '#3df5b4',
    tag: 'Law',
    filter: 'Law',
    category: 'Law',
    title: 'Right to Information — Your Secret Weapon',
    excerpt:
      "RTI laws let you demand answers from the government. Like, actually. Here's how to file an RTI and what you can ask for.",
    summary:
      'Right to Information laws let citizens request certain public information from government bodies to improve transparency and accountability.',
    readTime: '3 min read',
    fallback: {
      english: {
        simpleExplanation:
          'RTI stands for Right to Information. It gives citizens a legal way to ask some public institutions for records or information.',
        whyItMatters:
          'It helps people ask informed questions and pushes public bodies to be more answerable.',
        realLifeExample:
          'A citizen may want to know how a local project budget was used or what decision process was followed by a department.',
        oneSmallAction:
          'Check whether your province has an RTI law and what type of records can be requested officially.',
      },
      romanUrdu: {
        simpleExplanation:
          'RTI yani Right to Information aap ko yeh haq deta hai ke aap kuch public idaron se maloomat ya records maang sakein.',
        whyItMatters:
          'Is se awaam behtar sawal kar sakti hai aur idaray zyada jawabdeh bante hain.',
        realLifeExample:
          'Koi shehri pooch sakta hai ke kisi local project ka budget kahan kharch hua ya department ne faisla kis bunyad par kiya.',
        oneSmallAction:
          'Dekhein ke aap ke soobay mein RTI law hai ya nahin aur kis qisam ki maloomat maangi ja sakti hai.',
      },
    },
  },
  {
    id: 'federal-budget',
    emoji: '💰',
    bg: '#c4a8ff',
    tag: 'Budget',
    filter: 'Budget',
    category: 'Budget',
    title: "Pakistan's Federal Budget — Where Does Your Tax Money Go?",
    excerpt:
      "The budget is just the government's spending plan. But whose priorities are in it? And how does it actually affect your life?",
    summary:
      'The federal budget is the government’s yearly plan for raising money and deciding where national spending will go.',
    readTime: '6 min read',
    fallback: {
      english: {
        simpleExplanation:
          'The federal budget shows how the government plans to collect revenue and spend money during the year on areas like debt, defence, education, health, and development.',
        whyItMatters:
          'Budget choices affect public services, taxes, and which issues get more attention.',
        realLifeExample:
          'If more funds go to one sector and less to another, that can affect school quality, transport, or local services.',
        oneSmallAction:
          'When the budget is announced, read one simple summary from a reliable source and notice which sectors get priority.',
      },
      romanUrdu: {
        simpleExplanation:
          'Federal budget yeh batata hai ke hukumat saal bhar paisa kahan se layegi aur kahan kharch karegi, jaise taleem, sehat, development ya qarz.',
        whyItMatters:
          'Budget ke faislay public services, taxes aur priorities par seedha asar dalte hain.',
        realLifeExample:
          'Agar kisi sector ko zyada funds milen aur kisi ko kam, to us ka asar schools, transport ya local services par par sakta hai.',
        oneSmallAction:
          'Budget aane par kisi reliable source ka simple summary dekhein aur note karein ke kis sector ko priority mili.',
      },
    },
  },
  {
    id: 'misinformation',
    emoji: '📱',
    bg: '#ffd23f',
    tag: 'Law',
    filter: 'Law',
    category: 'Information',
    title: 'Misinformation — Why Viral Is Not the Same as True',
    excerpt:
      'Screenshots, reels, forwarded messages, fake quotes. Learn how misleading information spreads and how to slow it down.',
    summary:
      'Misinformation is false or misleading content shared as if it were true, even when the person sharing it may not mean harm.',
    readTime: '4 min read',
    fallback: {
      english: {
        simpleExplanation:
          'Misinformation is false or misleading information that spreads like it is true. It often travels fast through social media, captions, edited clips, and forwarded messages.',
        whyItMatters:
          'It can confuse people, create fear, and shape opinions unfairly before facts are checked.',
        realLifeExample:
          'A fake screenshot about elections or a clipped video can go viral and mislead thousands before anyone verifies it.',
        oneSmallAction:
          'Before sharing something emotional or political, check the source, date, and whether a trusted outlet confirms it.',
      },
      romanUrdu: {
        simpleExplanation:
          'Misinformation woh ghalat ya gumrah kun maloomat hoti hai jo sach samajh kar share ki jati hai. Yeh social media par bohat tezi se phail sakti hai.',
        whyItMatters:
          'Yeh logon ko confuse kar sakti hai, khauf paida kar sakti hai aur facts verify hone se pehle rae ko affect kar sakti hai.',
        realLifeExample:
          'Election ke hawalay se fake screenshot ya edit ki hui video viral ho kar hazaron logon ko gumrah kar sakti hai.',
        oneSmallAction:
          'Kisi bhi siyasi ya emotional post ko share karne se pehle source, date aur trusted confirmation check karein.',
      },
    },
  },
  {
    id: 'local-government',
    emoji: '🏘️',
    bg: '#7dbb8a',
    tag: 'Government',
    filter: 'Government',
    category: 'Government',
    title: 'Local Government — The Level Closest to Daily Life',
    excerpt:
      'Streetlights, sanitation, local roads, neighborhood issues. Local government is often the first level that affects daily routines.',
    summary:
      'Local government deals with community-level issues and services that often shape everyday life more directly than national politics.',
    readTime: '4 min read',
    fallback: {
      english: {
        simpleExplanation:
          'Local government usually handles issues closer to neighborhoods and towns, such as sanitation, local roads, community services, and local administration.',
        whyItMatters:
          'It affects practical daily-life problems that people notice quickly.',
        realLifeExample:
          'Problems like waste collection, broken streets, or poor local facilities are often linked to local governance.',
        oneSmallAction:
          'Identify one issue in your area and find out which local body or office is actually responsible for it.',
      },
      romanUrdu: {
        simpleExplanation:
          'Local government aam tor par mohallay aur shehar ke qareebi masail dekhti hai, jaise safai, local roads aur community services.',
        whyItMatters:
          'Yeh un practical masail par asar dalti hai jo log rozana mehsoos karte hain.',
        realLifeExample:
          'Kachra uthana, gali ki halat ya local facilities ki kami jaise masail aksar local governance se related hote hain.',
        oneSmallAction:
          'Apne area ka ek masla choose karein aur pata lagayen ke us ka zimmedar local office kaunsa hai.',
      },
    },
  },
  {
    id: 'peaceful-civic-participation',
    emoji: '✋',
    bg: '#9fd0ff',
    tag: 'Participation',
    filter: 'Participation',
    category: 'Participation',
    title: 'Peaceful Civic Participation — Using Your Voice Safely',
    excerpt:
      'Civic participation is not only voting. It also includes asking questions, joining community efforts, and speaking responsibly.',
    summary:
      'Peaceful civic participation means taking part in public life through safe, lawful, and constructive actions.',
    readTime: '3 min read',
    fallback: {
      english: {
        simpleExplanation:
          'Peaceful civic participation means joining public life in safe and lawful ways, such as volunteering, asking questions, attending community activities, and raising issues respectfully.',
        whyItMatters:
          'It helps people contribute without needing power, money, or a formal political role.',
        realLifeExample:
          'A student can join a campus awareness drive, help organize a local clean-up, or raise a public issue through verified channels.',
        oneSmallAction:
          'Choose one low-risk way to participate this month, like attending a trusted community event or learning how to report a local issue.',
      },
      romanUrdu: {
        simpleExplanation:
          'Peaceful civic participation ka matlab hai public life mein mehfooz, qanooni aur tameeri tareeqay se hissa lena, jaise volunteering, sawal karna ya community activity join karna.',
        whyItMatters:
          'Is se log baghair kisi formal power ke bhi apna hissa daal sakte hain.',
        realLifeExample:
          'Koi student campus awareness drive join kar sakta hai, local clean-up mein hissa le sakta hai ya verified channel se public masla raise kar sakta hai.',
        oneSmallAction:
          'Is mahine ek simple aur low-risk tareeqa choose karein jisse aap civic life mein hissa le sakein.',
      },
    },
  },
]

export function getLearnTopicById(topicId) {
  return LEARN_TOPICS.find((topic) => topic.id === topicId) ?? null
}
