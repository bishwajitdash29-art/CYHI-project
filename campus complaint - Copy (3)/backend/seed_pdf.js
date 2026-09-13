const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

const studentsText = `
1 25BCS002 AATISH KUMAR 25bcs002@iiitdmj.ac.in
2 25BCS003 AAYUSH GOUND 25bcs003@iiitdmj.ac.in
3 25BCS004 AAYUSH KUMAWAT 25bcs004@iiitdmj.ac.in
4 25BCS005 ABHAY DHURVE 25bcs005@iiitdmj.ac.in
5 25BCS007 ABHIRAM DARBHA 25bcs007@iiitdmj.ac.in
6 25BCS008 ABHISHANK JITENDRA SINGH 25bcs008@iiitdmj.ac.in
7 25BCS009 ADARSH NATH 25bcs009@iiitdmj.ac.in
8 25BCS010 ADBALWAR PANDURANG RAJENDRAKUMAR 25bcs010@iiitdmj.ac.in
9 25BCS011 ADITYA NIRANJAN PATIL 25bcs011@iiitdmj.ac.in
10 25BCS012 ADITYA PRATAP SINGH 25bcs012@iiitdmj.ac.in
11 25BCS013 ADITYA RAI 25bcs013@iiitdmj.ac.in
12 25BCS014 ADITYA RAJ DHAKED 25bcs014@iiitdmj.ac.in
13 25BCS015 ADITYA SHARMA 25bcs015@iiitdmj.ac.in
14 25BCS016 ADITYA YADAV 25bcs016@iiitdmj.ac.in
15 25BCS017 AEMAN KHAN 25bcs017@iiitdmj.ac.in
16 25BCS018 AGAPATI ABHIRAM 25bcs018@iiitdmj.ac.in
17 25BCS019 AKUBATHINI SUMITHSAI CHANDRA 25bcs019@iiitdmj.ac.in
18 25BCS020 ALLAM SANTHOSH 25bcs020@iiitdmj.ac.in
19 25BCS021 ALOK PRAJAPATI 25bcs021@iiitdmj.ac.in
20 25BCS022 AMAN SHEORAN 25bcs022@iiitdmj.ac.in
21 25BCS024 AMRUTHALA SUSHANTH 25bcs024@iiitdmj.ac.in
22 25BCS025 ANIL POSWAL 25bcs025@iiitdmj.ac.in
23 25BCS026 ANMOL GAJANAN PATIL 25bcs026@iiitdmj.ac.in
24 25BCS027 ANSHU KANRAR 25bcs027@iiitdmj.ac.in
25 25BCS028 ANUBHAV SHARMA 25bcs028@iiitdmj.ac.in
26 25BCS029 ARANYA MANDAL 25bcs029@iiitdmj.ac.in
27 25BCS030 ARAV PRAJAPAT 25bcs030@iiitdmj.ac.in
28 25BCS031 ARJAV JAIN 25bcs031@iiitdmj.ac.in
29 25BCS032 ARYAN SRIKANT RAWAS 25bcs032@iiitdmj.ac.in
30 25BCS033 ASHUTOSH VERMA 25bcs033@iiitdmj.ac.in
31 25BCS034 ASHWIN SINGH 25bcs034@iiitdmj.ac.in
32 25BCS035 ATHARV ASHUTOSH KULKARNI 25bcs035@iiitdmj.ac.in
33 25BCS036 ATHARV NAWAB 25bcs036@iiitdmj.ac.in
34 25BCS037 ATINDRA KUNDU 25bcs037@iiitdmj.ac.in
35 25BCS038 AVIK SHARMA 25bcs038@iiitdmj.ac.in
36 25BCS039 AVNEESH KUMAR 25bcs039@iiitdmj.ac.in
37 25BCS040 AVUNOORI SHIVA SHANKAR 25bcs040@iiitdmj.ac.in
38 25BCS041 AYUSH GUPTA 25bcs041@iiitdmj.ac.in
39 25BCS042 AYUSH MISHRA 25bcs042@iiitdmj.ac.in
40 25BCS044 AYUSH PRASAD 25bcs044@iiitdmj.ac.in
41 25BCS046 BAMMIDI YASWANTH 25bcs046@iiitdmj.ac.in
42 25BCS047 BELLALA PRAVEEN KUMAR 25bcs047@iiitdmj.ac.in
43 25BCS048 BELLAMKONDA VIJWAL 25bcs048@iiitdmj.ac.in
44 25BCS049 BHAVESH KAG 25bcs049@iiitdmj.ac.in
45 25BCS050 BHAVESH PANDEY 25bcs050@iiitdmj.ac.in
46 25BCS051 BHAVYA SINGH 25bcs051@iiitdmj.ac.in
47 25BCS052 BISHWAJIT DASH 25bcs052@iiitdmj.ac.in
48 25BCS053 BOLLAM ADITHYA 25bcs053@iiitdmj.ac.in
49 25BCS054 BURAGAPU YASWANTH KRISHNA 25bcs054@iiitdmj.ac.in
50 25BCS055 CHALLA PENCHALA CHAITHANYA 25bcs055@iiitdmj.ac.in
51 25BCS056 CHAVDA DEV GANSHYAMKUMAR 25bcs056@iiitdmj.ac.in
52 25BCS057 CHEEPATI NITHIN REDDY 25bcs057@iiitdmj.ac.in
53 25BCS058 CHINTABATTHINI ANAND BABU 25bcs058@iiitdmj.ac.in
54 25BCS059 CHOWDIREDDYGARI HASINI 25bcs059@iiitdmj.ac.in
55 25BCS060 DAVE NAIRUTI ALPESH 25bcs060@iiitdmj.ac.in
56 25BCS061 DEEKSHITH REDDY KATUKURI 25bcs061@iiitdmj.ac.in
57 25BCS062 DEEP RANJAN KUMAR 25bcs062@iiitdmj.ac.in
58 25BCS063 DEEPALI 25bcs063@iiitdmj.ac.in
59 25BCS064 DEEPENDRA 25bcs064@iiitdmj.ac.in
60 25BCS065 DEV VERMA 25bcs065@iiitdmj.ac.in
61 25BCS066 DEVAGUPTAPU RAM CHERAN 25bcs066@iiitdmj.ac.in
62 25BCS067 DHANANI RUDRA TUSHARBHAI 25bcs067@iiitdmj.ac.in
63 25BCS068 DHANRAJ KUMAR 25bcs068@iiitdmj.ac.in
64 25BCS069 DHARMANI ADITYA DURGA PRASAD 25bcs069@iiitdmj.ac.in
65 25BCS071 DHRUV BOHRA 25bcs071@iiitdmj.ac.in
66 25BCS072 DHRUVI PRADIP PATIL 25bcs072@iiitdmj.ac.in
67 25BCS073 DIDDUKURI LIKITH AKSHAY 25bcs073@iiitdmj.ac.in
68 25BCS074 DIVYANSH SINGH 25bcs074@iiitdmj.ac.in
69 25BCS075 DIVYANSHI BHAGWAT MADAVI 25bcs075@iiitdmj.ac.in
70 25BCS076 DIVYANSHU PRAJAPATI 25bcs076@iiitdmj.ac.in
71 25BCS077 DIXIT VEDANT SUJIT 25bcs077@iiitdmj.ac.in
72 25BCS078 DULLA SHARAN TEJA REDDY 25bcs078@iiitdmj.ac.in
73 25BCS079 EEDALA RISHI RAGHAVENDRA 25bcs079@iiitdmj.ac.in
74 25BCS080 ELLA HASINI 25bcs080@iiitdmj.ac.in
75 25BCS081 ESLAVATH ARAVIND 25bcs081@iiitdmj.ac.in
76 25BCS082 ESWARA VENKATA MANOHAR 25bcs082@iiitdmj.ac.in
77 25BCS083 GADILLI MADHURI 25bcs083@iiitdmj.ac.in
78 25BCS084 GAJULA VISHNU VARDHAN 25bcs084@iiitdmj.ac.in
79 25BCS085 GAMIT JAYKUMAR ASHWINBHAI 25bcs085@iiitdmj.ac.in
80 25BCS086 GOKA HARSHITHA 25bcs086@iiitdmj.ac.in
81 25BCS087 GOVIND GAUTAM 25bcs087@iiitdmj.ac.in
82 25BCS088 GRANDHI PRANEETHA 25bcs088@iiitdmj.ac.in
83 25BCS089 GRANDHI TANAY KUMAR 25bcs089@iiitdmj.ac.in
84 25BCS090 GUNDA VIKAS 25bcs090@iiitdmj.ac.in
85 25BCS091 HARI BHAGAT 25bcs091@iiitdmj.ac.in
86 25BCS092 HARISH SWAMI 25bcs092@iiitdmj.ac.in
87 25BCS093 HARSH VARDHAN SINGH 25bcs093@iiitdmj.ac.in
88 25BCS094 HARSHAL VISHALBHAI KANSAGARA 25bcs094@iiitdmj.ac.in
89 25BCS095 HARSHIT NIGAM 25bcs095@iiitdmj.ac.in
90 25BCS096 ISHIKA SINGH 25bcs096@iiitdmj.ac.in
91 25BCS097 JAIVEER SINGH 25bcs097@iiitdmj.ac.in
92 25BCS098 JANGID SHREYAN MUKESH 25bcs098@iiitdmj.ac.in
93 25BCS099 JEEYA AJAYKUMAR PATEL 25bcs099@iiitdmj.ac.in
94 25BCS100 JENIL NATHABHAI KORAT 25bcs100@iiitdmj.ac.in
95 25BCS101 JETTI JAHNAVI 25bcs101@iiitdmj.ac.in
96 25BCS102 JOGINIPELLI SACHITH 25bcs102@iiitdmj.ac.in
97 25BCS103 K V RAGHAV 25bcs103@iiitdmj.ac.in
98 25BCS104 KADAGOTI BABITHA RAO 25bcs104@iiitdmj.ac.in
99 25BCS105 KAKARLA SATYANVITH REDDY 25bcs105@iiitdmj.ac.in
100 25BCS106 KALIKANT TRIPATHI 25bcs106@iiitdmj.ac.in
101 25BCS107 KANCHI NIGAM 25bcs107@iiitdmj.ac.in
102 25BCS108 KANIKE KEDHARNATH 25bcs108@iiitdmj.ac.in
103 25BCS109 KARANAM SHRIYA 25bcs109@iiitdmj.ac.in
104 25BCS110 KARNA NIHAAL REDDY 25bcs110@iiitdmj.ac.in
105 25BCS111 KARNATI SAHASRA 25bcs111@iiitdmj.ac.in
106 25BCS112 KATARI NUTAN KISHORE 25bcs112@iiitdmj.ac.in
107 25BCS113 KEERTHANRAJ JAKANUR 25bcs113@iiitdmj.ac.in
108 25BCS114 KEKAN VEDANT RAMPRASAD 25bcs114@iiitdmj.ac.in
109 25BCS115 KEMISETTY SAI AJAY KUMAR 25bcs115@iiitdmj.ac.in
110 25BCS116 KETAN SHARMA 25bcs116@iiitdmj.ac.in
111 25BCS117 KETHEPALLY HARI SRIKAR 25bcs117@iiitdmj.ac.in
112 25BCS118 KISHLAY KUMAR 25bcs118@iiitdmj.ac.in
113 25BCS119 KONDA RISHIT SAI 25bcs119@iiitdmj.ac.in
114 25BCS120 KONDREDDY REVANTH REDDY 25bcs120@iiitdmj.ac.in
115 25BCS121 KORVI SHARAN 25bcs121@iiitdmj.ac.in
116 25BCS122 KOTA MURARIDHAR REDDY 25bcs122@iiitdmj.ac.in
117 25BCS123 KRISHIV KUMAR 25bcs123@iiitdmj.ac.in
118 25BCS124 KRITARTH SHARMA 25bcs124@iiitdmj.ac.in
119 25BCS125 KSHITIJ GOYAL 25bcs125@iiitdmj.ac.in
120 25BCS126 KUNAL CHOUHAN 25bcs126@iiitdmj.ac.in
121 25BCS127 LAKKIREDDY AJITH KUMAR REDDY 25bcs127@iiitdmj.ac.in
122 25BCS128 LAKSHYA SHARMA 25bcs128@iiitdmj.ac.in
123 25BCS129 LINGAVARAPU LOHI AISHWARYA 25bcs129@iiitdmj.ac.in
124 25BCS130 MADDIREDDY VINAYAKA KARTHIKEYA REDDY 25bcs130@iiitdmj.ac.in
125 25BCS131 MADHUR TARE 25bcs131@iiitdmj.ac.in
126 25BCS132 MAHAK SALONIYA 25bcs132@iiitdmj.ac.in
127 25BCS133 MAHESH VISHNOI 25bcs133@iiitdmj.ac.in
128 25BCS134 MANDA VASANTH ANVESH 25bcs134@iiitdmj.ac.in
129 25BCS135 MANDUGULA TITUS 25bcs135@iiitdmj.ac.in
130 25BCS136 MANGAL SURESH SHARMA 25bcs136@iiitdmj.ac.in
131 25BCS137 MANJEET KUMAR 25bcs137@iiitdmj.ac.in
132 25BCS138 MANKAR SUBODH SWAGAT 25bcs138@iiitdmj.ac.in
133 25BCS139 MANVI NAREDI 25bcs139@iiitdmj.ac.in
134 25BCS140 MAYANK MANITHIA 25bcs140@iiitdmj.ac.in
135 25BCS142 MISHTHI GUPTA 25bcs142@iiitdmj.ac.in
136 25BCS143 MOHAMMED ABDUL MUQEEM 25bcs143@iiitdmj.ac.in
137 25BCS144 MOHD AMASH MISBAH 25bcs144@iiitdmj.ac.in
138 25BCS145 MOHIT KUMAR 25bcs145@iiitdmj.ac.in
139 25BCS146 MOHIT KUMAR MEENA 25bcs146@iiitdmj.ac.in
140 25BCS147 MOHIT RAJ 25bcs147@iiitdmj.ac.in
141 25BCS148 MOOLI SREE LEKHA 25bcs148@iiitdmj.ac.in
142 25BCS149 MORASA RAMCHARAN 25bcs149@iiitdmj.ac.in
143 25BCS150 MUKESH 25bcs150@iiitdmj.ac.in
144 22BCS167 NALIGALA SATHWIK 22bcs167@iiitdmj.ac.in
145 23BCS231 SHELKE SAKSHI VISHWAS 23bcs231@iiitdmj.ac.in
146 24BCS162 NALLU RISHITHA 24bcs162@iiitdmj.ac.in
147 24BCS164 NANDHYALA VIDEEKSHA 24bcs164@iiitdmj.ac.in
148 24BCS249 TANISHQ JITENDRA PATIL 24bcs249@iiitdmj.ac.in
149 24BCS258 UTTARKAR USHA SREE 24bcs258@iiitdmj.ac.in
150 24BCS272 VUPPALA CHAITHRA 24bcs272@iiitdmj.ac.in
151 25BCS151 MUKESH KUMAR 25bcs151@iiitdmj.ac.in
152 25BCS152 MUKKARA LIKHITHA REDDY 25bcs152@iiitdmj.ac.in
153 25BCS153 MUSKAN KUMARI 25bcs153@iiitdmj.ac.in
154 25BCS154 NAGRALE AJINKYA VINOD 25bcs154@iiitdmj.ac.in
155 25BCS155 NAMAN AGARWAL 25bcs155@iiitdmj.ac.in
156 25BCS156 NARLA MUKTHIDHA 25bcs156@iiitdmj.ac.in
157 25BCS157 NEHA 25bcs157@iiitdmj.ac.in
158 25BCS158 NEHA 25bcs158@iiitdmj.ac.in
159 25BCS159 NEHAL JOSHI 25bcs159@iiitdmj.ac.in
160 25BCS160 NENAVATH SREEKANTH 25bcs160@iiitdmj.ac.in
161 25BCS161 NICHENAMETLA NIHITH 25bcs161@iiitdmj.ac.in
162 25BCS162 NIKHIL CHAUTHIYA 25bcs162@iiitdmj.ac.in
163 25BCS163 NIZAMPATNAM GIRISH VENKATA MAΝΙΚΑΝΤΑ 25bcs163@iiitdmj.ac.in
164 25BCS164 NOMULA SIRI CHANDANA 25bcs164@iiitdmj.ac.in
165 25BCS165 OMJAY KUMAR 25bcs165@iiitdmj.ac.in
166 25BCS166 OMKAR SANJAY JALKE 25bcs166@iiitdmj.ac.in
167 25BCS167 PADMA AKSHARA 25bcs167@iiitdmj.ac.in
168 25BCS168 PALAKURTHI AKSHAY 25bcs168@iiitdmj.ac.in
169 25BCS169 PALAVALLI SRI SAI GANESH 25bcs169@iiitdmj.ac.in
170 25BCS170 PALEPALLI UMESH CHANDRA REDDY 25bcs170@iiitdmj.ac.in
171 25BCS172 PARIDHI GUPTA 25bcs172@iiitdmj.ac.in
172 25BCS173 PARMAR DEEP VINODBHAI 25bcs173@iiitdmj.ac.in
173 25BCS174 PATHIKRIT DAS 25bcs174@iiitdmj.ac.in
174 25BCS175 PATHLAVATH AKHIL 25bcs175@iiitdmj.ac.in
175 25BCS176 PATHLAVATH SNEHA LATHA 25bcs176@iiitdmj.ac.in
176 25BCS177 PAWAR ANKOOR DAMODAR 25bcs177@iiitdmj.ac.in
177 25BCS179 PEDDI SHIVA TEJA 25bcs179@iiitdmj.ac.in
178 25BCS180 PIYUSH MALEWAR 25bcs180@iiitdmj.ac.in
179 25BCS181 POTE ROHAN JITENDRA 25bcs181@iiitdmj.ac.in
180 25BCS182 PRAJEET TALREJA 25bcs182@iiitdmj.ac.in
181 25BCS183 PRANAV KUMAR 25bcs183@iiitdmj.ac.in
182 25BCS184 PRANAV PRATAP SINGH 25bcs184@iiitdmj.ac.in
183 25BCS185 PRASHANT PRABHAKAR 25bcs185@iiitdmj.ac.in
184 25BCS186 PRASHANT SENGAR 25bcs186@iiitdmj.ac.in
185 25BCS187 PRATEEK DAMODAR SHANBHAG 25bcs187@iiitdmj.ac.in
186 25BCS188 PRINCE TOMAR 25bcs188@iiitdmj.ac.in
187 25BCS189 PRIYANSHU KARKI 25bcs189@iiitdmj.ac.in
188 25BCS190 PRUDHIVI HEMA 25bcs190@iiitdmj.ac.in
189 25BCS191 PUCCHAGINJALA BADARINATH 25bcs191@iiitdmj.ac.in
190 25BCS192 PULI RITHVIKA 25bcs192@iiitdmj.ac.in
191 25BCS193 PURASTHU SRI SAI LIKHITH 25bcs193@iiitdmj.ac.in
192 25BCS194 R SANJEEVA 25bcs194@iiitdmj.ac.in
193 25BCS195 RACHAMALLA PRANEETH REDDY 25bcs195@iiitdmj.ac.in
194 25BCS196 RAGHVENDRA BARAIYA 25bcs196@iiitdmj.ac.in
195 25BCS197 RAMAVATH VIKAS 25bcs197@iiitdmj.ac.in
196 25BCS198 RANGU MANIDEEP 25bcs198@iiitdmj.ac.in
197 25BCS199 RAVULA VISHWANTH SAI 25bcs199@iiitdmj.ac.in
198 25BCS200 REDDY GIRICHARAN 25bcs200@iiitdmj.ac.in
199 25BCS201 REDDYMALLA RISHITH REDDY 25bcs201@iiitdmj.ac.in
200 25BCS202 REPALA RISHIK 25bcs202@iiitdmj.ac.in
201 25BCS203 RHYTHM GARG 25bcs203@iiitdmj.ac.in
202 25BCS204 RISHABH 25bcs204@iiitdmj.ac.in
203 25BCS205 ROHIT BELLIKATTI 25bcs205@iiitdmj.ac.in
204 25BCS206 RONAK KUMAWAT 25bcs206@iiitdmj.ac.in
205 25BCS208 RUCHIRA KOYALAGUNDLA 25bcs208@iiitdmj.ac.in
206 25BCS209 RUDRANSH RAHUL JAISWAL 25bcs209@iiitdmj.ac.in
207 25BCS210 S JOHANAN ROSH 25bcs210@iiitdmj.ac.in
208 25BCS211 SAHARE CHANDAN RAJAN 25bcs211@iiitdmj.ac.in
209 25BCS212 SAHELI SIKDAR 25bcs212@iiitdmj.ac.in
210 25BCS213 SAIYAM AGRAWAL 25bcs213@iiitdmj.ac.in
211 25BCS214 SAKIRAMOLLA KIRAN TEJA REDDY 25bcs214@iiitdmj.ac.in
212 25BCS215 SAMARTH VERMA 25bcs215@iiitdmj.ac.in
213 25BCS216 SAMPREET CHENNA 25bcs216@iiitdmj.ac.in
214 25BCS217 SAMRUDDHI SANTOSH BHINGARDEVE 25bcs217@iiitdmj.ac.in
215 25BCS218 SATYAM 25bcs218@iiitdmj.ac.in
216 25BCS219 SETHI SHUBHAM KRUSHNA 25bcs219@iiitdmj.ac.in
217 25BCS220 SHARMA ABHIJAY DHIREN 25bcs220@iiitdmj.ac.in
218 25BCS221 SHAWN MISHRA 25bcs221@iiitdmj.ac.in
219 25BCS222 SHIVANG GUPTA 25bcs222@iiitdmj.ac.in
220 25BCS223 SHIVANG KUMAR GUPTA 25bcs223@iiitdmj.ac.in
221 25BCS224 SHIVEN DHANKHAR 25bcs224@iiitdmj.ac.in
222 25BCS225 SHRAAVYA RAJESH 25bcs225@iiitdmj.ac.in
223 25BCS226 SHRADDHA SADASHIV JIRWANKAR 25bcs226@iiitdmj.ac.in
224 25BCS227 SHREYA JHA 25bcs227@iiitdmj.ac.in
225 25BCS228 SHREYAK INDANE 25bcs228@iiitdmj.ac.in
226 25BCS229 SHREYANSH JAISWAL 25bcs229@iiitdmj.ac.in
227 25BCS230 SHRIKA SOMISETTI 25bcs230@iiitdmj.ac.in
228 25BCS231 SINGH KESHAV AJAY 25bcs231@iiitdmj.ac.in
229 25BCS232 SONAWANE RITESH ANIL 25bcs232@iiitdmj.ac.in
230 25BCS233 SONWANE MOHINI SHESHARAO 25bcs233@iiitdmj.ac.in
231 25BCS234 SUKHPREET SINGH 25bcs234@iiitdmj.ac.in
232 25BCS235 SUMIT RAMANKATTI 25bcs235@iiitdmj.ac.in
233 25BCS236 TANU SINGH 25bcs236@iiitdmj.ac.in
234 25BCS237 TAVVA MUKESH SAI KRISHNA 25bcs237@iiitdmj.ac.in
235 25BCS238 TEJAS AGARWAL 25bcs238@iiitdmj.ac.in
236 25BCS239 TELUGU VAISHNAVI 25bcs239@iiitdmj.ac.in
237 25BCS240 THAMBIREDDY SAANVI REDDY 25bcs240@iiitdmj.ac.in
238 25BCS241 THOKALA NISHANTH REDDY 25bcs241@iiitdmj.ac.in
239 25BCS242 TRIPATHI YASH VISHALBHAI 25bcs242@iiitdmj.ac.in
240 25BCS243 UJJWAL TYAGI 25bcs243@iiitdmj.ac.in
241 25BCS244 UPPALA SRI SWAROOP 25bcs244@iiitdmj.ac.in
242 25BCS246 VADITHE SIVAJI NAIK 25bcs246@iiitdmj.ac.in
243 25BCS247 VADITHE VARSHIKA BAI 25bcs247@iiitdmj.ac.in
244 25BCS248 VANGALA SIRI CHANDHANA 25bcs248@iiitdmj.ac.in
245 25BCS249 VANSH 25bcs249@iiitdmj.ac.in
246 25BCS250 VANSHIKA RAJPALI 25bcs250@iiitdmj.ac.in
247 25BCS251 VARIKUNTLA VINSITHA 25bcs251@iiitdmj.ac.in
248 25BCS252 VEDANT RAMESHWAR ALONE 25bcs252@iiitdmj.ac.in
249 25BCS253 VENNAM DHURGA TEJESWAR REDDY 25bcs253@iiitdmj.ac.in
250 25BCS254 VIDHIKA SAXENA 25bcs254@iiitdmj.ac.in
251 25BCS255 VIKHYAAT SRIVASTAVA 25bcs255@iiitdmj.ac.in
252 25BCS256 VINAY BHANDARI 25bcs256@iiitdmj.ac.in
253 25BCS257 VINAY JANGID 25bcs257@iiitdmj.ac.in
254 25BCS258 VINAYAK DAMODAR 25bcs258@iiitdmj.ac.in
255 25BCS259 VIPAN NAYAK 25bcs259@iiitdmj.ac.in
256 25BCS260 VIRENDRA CHOUHAN 25bcs260@iiitdmj.ac.in
257 25BCS262 VIVEK SHARMA 25bcs262@iiitdmj.ac.in
258 25BCS263 VIYUSH SINGH 25bcs263@iiitdmj.ac.in
259 25BCS265 VURIBINDI AJAY JASWANTH KUMAR 25bcs265@iiitdmj.ac.in
260 25BCS266 VUSTHELA RAMA TULASI 25bcs266@iiitdmj.ac.in
261 25BCS267 YALLAMPALLI PRANATHI 25bcs267@iiitdmj.ac.in
262 25BCS268 YARASANI HAREESH REDDY 25bcs268@iiitdmj.ac.in
263 25BCS269 YARRA BHARGAVA PURNA 25bcs269@iiitdmj.ac.in
264 25BCS270 YARRU VAMSI ADITHYA 25bcs270@iiitdmj.ac.in
265 25BCS271 YASHIKA GARG 25bcs271@iiitdmj.ac.in
266 25BCS272 YASHVARDHAN SAGAR THORAT 25bcs272@iiitdmj.ac.in
267 25BCS273 YENIKA PRITHIKA KRISHNA 25bcs273@iiitdmj.ac.in
268 25BCS274 YERRA LAKSHMI SAI ISHANTH 25bcs274@iiitdmj.ac.in
269 25BCS275 YOGEESHVAR S 25bcs275@iiitdmj.ac.in
270 25BCS276 ADITI TIWARI 25bcs276@iiitdmj.ac.in
271 25BCS277 ARJUN SETHUMADHAVAN 25bcs277@iiitdmj.ac.in
272 25BCS278 ΒΙΑΝΚΑ PAUL 25bcs278@iiitdmj.ac.in
273 25BCS280 HABEN EASOW ROBBY 25bcs280@iiitdmj.ac.in
274 25BCS281 HARSHAD R 25bcs281@iiitdmj.ac.in
275 25BCS282 MOHAMMED SHAHEEM 25bcs282@iiitdmj.ac.in
276 25BCS283 THOMAS SUNOJ ANJILIVELIL 25bcs283@iiitdmj.ac.in
277 25BCS285 GAURI BAISHNAVI 25bcs285@iiitdmj.ac.in
278 25BCS286 SRABAN MUKHERJEE SWAPNO 25bcs286@iiitdmj.ac.in
279 25BEC036 GOKHALE JANHVI NARENDRAKUMAR 25bec036@iiitdmj.ac.in
280 25BEC046 KANCHANWAR SIDDHANT SHANKARRAO 25bec046@iiitdmj.ac.in
281 25BEC076 PATIL VEDANT SANJAY 25bec076@iiitdmj.ac.in
282 25BEC080 PIYUSH PATEL 25bcs080@iiitdmj.ac.in
283 25BEC120 SOMYA PANDEY 25bec120@iiitdmj.ac.in
284 25BEC123 SUNNY KUMAR 25bec123@iiitdmj.ac.in
285 25BME025 JEET RAJAN BHOYAR 25bme025@iiitdmj.ac.in
286 25BME027 KARISHMA KUMARI 25bme027@iiitdmj.ac.in
287 25BME060 SHASHI PRATAP 25bme060@iiitdmj.ac.in
288 25BSM010 ANURAG RAJ 25bsm010@iiitdmj.ac.in
289 25BSM054 SANTOSH SINGH BISHT 25bsm054@iiitdmj.ac.in
290 25BSM059 SHASHANK SAURAV 25bsm059@iiitdmj.ac.in
`;

const staffText = `
Prof. Bhartendu K. Singh Natural Sciences Professor & Director Physics of Particles and Nuclei director@iiitdmj.ac.in
Prof. Vijay Kumar Gupta Mechanical Engineering Professor (Dean Academic) Energy Harvesting, Smart Structures, MEMS vkgupta@iiitdmj.ac.in
Mr. Santosh Mahobia Administration Deputy Registrar Academic Office Administration santosh@iiitdmj.ac.in
Prof. Tanuja Sheorey Mechanical Engineering Professor & Head of Department Computational Fluid Dynamics, Smart Materials tanush@iiitdmj.ac.in
Dr. Bhupendra Gupta Natural Sciences Assistant Professor & Head of Discipline Random Network, Computer Vision bhupen@iiitdmj.ac.in
Prof. Aparajita Ojha Computer Science & Engineering Professor Machine/Deep Learning, Computer Vision aojha@iiitdmj.ac.in
Dr. Anil Kumar Electronics & Comm. Engineering Associate Professor & Head of Department Multirate Signal Processing anilk@iiitdmj.ac.in
Prof. Pritee Khanna Computer Science & Engineering Professor Biometrics, Image and Semantic Retrieval pkhanna@iiitdmj.ac.in
Prof. Dinesh Kumar V. Electronics & Comm. Engineering Professor Electromagnetics, Antennas, Optical Comm. dineshk@iiitdmj.ac.in
Prof. Prabin K. Padhy Electronics & Comm. Engineering Professor Automatic Controller Tuning, Processes prabin16@iiitdmj.ac.in
Prof. Sanjeev Narayan Sharma Electronics & Comm. Engineering Professor Signal Processing, Computational Genomics snsharma@iiitdmj.ac.in
Prof. Puneet Tandon Mechanical Engineering & Design Professor Digital Design & Manufacturing ptandon@iiitdmj.ac.in
Prof. Prashant K. Jain Mechanical Engineering Professor (On Deputation) pkjain@iiitdmj.ac.in
Dr. M. Zahid Ansari Mechanical Engineering Associate Professor MEMS, Smart Materials, Composites zahid@iiitdmj.ac.in
Dr. Prabir Mukhopadhyay Design Discipline Associate Professor Injury Prediction, Occupational Ergonomics prabir@iiitdmj.ac.in
Dr. Asish K. Kundu Natural Sciences (Physics) Associate Professor Physics asish.kundu@iiitdmj.ac.in
Dr. Akshay Pandey Computer Science & Engineering Assistant Professor WebGIS, Deep Learning, Remote Sensing drakshay@iiitdmj.ac.in
Dr. Ashish Singh Parihar Computer Science & Engineering Assistant Professor Theoretical Computer Science, Big DATA ashish.parihar@iiitdmj.ac.in
Dr. Durgesh Singh Computer Science & Engineering Assistant Professor Image Processing, Machine Learning durgesh@iiitdmj.ac.in
Dr. Ranjeet Kumar Ranjan Computer Science & Engineering Assistant Professor Data Warehousing, Soft Computing ranjeet.kr@iiitdmj.ac.in
Dr. Shivansh Mishra Computer Science & Engineering Assistant Professor Social Network Analysis, Community Detection shivansh@iiitdmj.ac.in
Dr. Sraban Kumar Mohanty Computer Science & Engineering Assistant Professor Data Clustering, Proximity measures sraban@iiitdmj.ac.in
Dr. Dip Prakash Samajdar Electronics & Comm. Engineering Assistant Professor VLSI and Optoelectronics dip.samajdar@iiitdmj.ac.in
Dr. Pushpa Raikwal Electronics & Comm. Engineering Assistant Professor Memory Design, VLSI System Design pushpa@iiitdmj.ac.in
Dr. Trivesh Kumar Electronics & Comm. Engineering Assistant Professor RF and Microwave Antennas trivesh@iiitdmj.ac.in
Dr. Satish Kumar Tiwari Electronics & Comm. Engineering Assistant Professor 6G, Nano Communication, Statistical SP satish@iiitdmj.ac.in
Dr. Amit Vishwakarma Electronics & Comm. Engineering Assistant Professor Signal & Image Processing, ML amit@iiitdmj.ac.in
Dr. Koushik Dutta Electronics & Comm. Engineering Assistant Professor Memristor Device & Circuits, Gas Sensors koushik@iiitdmj.ac.in
Dr. Matadeen Bansal Electronics & Comm. Engineering Assistant Professor Wireless Communication mbansal@iiitdmj.ac.in
Dr. Sachin Kumar Jain Electronics & Comm. Engineering Assistant Professor Power & Control skjain@iiitdmj.ac.in
Dr. Avinash Ravi Raja Mechanical Engineering Assistant Professor Friction stir welding, Metal matrix Composite avinash.raviraja@iiitdmj.ac.in
Dr. Tushar Choudhary Mechanical Engineering Assistant Professor CFD, FEA, Automobile, Thermodynamics tushar.choudhary@iiitdmj.ac.in
Dr. Rabindra Prasad Mechanical Engineering Assistant Professor Discontinuously Reinforced Aluminum Composites rabindrap@iiitdmj.ac.in
Dr. Amrita Bhattacharjee Design Discipline Assistant Professor Lighting Design, Visual Perception amrita@iiitdmj.ac.in
Dr. Amaresh Chandra Mishra Natural Sciences (Physics) Assistant Professor Magnetic thin films, Magnetoimpedance amresh@iiitdmj.ac.in
Dr. Deepmala Natural Sciences (Mathematics) Assistant Professor Optimization Theory and Applications deepmala@iiitdmj.ac.in
Dr. Lokendra Kumar Balyan Natural Sciences (Mathematics) Assistant Professor Computational Methods for PDEs balyan@iiitdmj.ac.in
Dr. Manoj Kumar Panda Natural Sciences (Mathematics) Assistant Professor Mathematics mkpanda@iiitdmj.ac.in
Dr. Mukesh Kumar Roy Natural Sciences (Physics) Assistant Professor Physics mkroy@iiitdmj.ac.in
Dr. Neeraj K. Jaiswal Natural Sciences (Physics) Assistant Professor Physics neeraj@iiitdmj.ac.in
Dr. Nihar Kumar Mahato Natural Sciences (Mathematics) Assistant Professor Mathematics nihar@iiitdmj.ac.in
Dr. Nihar Ranjan Jena Natural Sciences (Physics) Assistant Professor Physics nrjena@iiitdmj.ac.in
Dr. Subir Lamba Natural Sciences (Mathematics) Assistant Professor Mathematics subirs@iiitdmj.ac.in
Dr. Yashpal Singh Katharria Natural Sciences (Physics) Assistant Professor Physics yashpalk@iiitdmj.ac.in
`;

async function seed() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Wipe DB first to clear previous incorrect registrations
  await prisma.reply.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Students
  const studentLines = studentsText.split('\n').filter(l => l.trim().length > 0);
  for (const line of studentLines) {
    const parts = line.split(' ');
    if (parts.length < 4) continue;
    const email = parts[parts.length - 1];
    parts.pop(); 
    parts.shift();
    parts.shift(); // Remove number and roll no
    const name = parts.join(' ');
    
    try {
        await prisma.user.create({
            data: { username: email, password: hashedPassword, name: name, role: 'STUDENT' }
        });
    } catch(e) {}
  }

  // Seed Staff
  const staffLines = staffText.split('\n').filter(l => l.trim().length > 0);
  for (const line of staffLines) {
    const parts = line.split(' ');
    let email = parts[parts.length - 1];
    
    // Better name extraction: stop when we hit a department name
    const stopWords = ['Natural', 'Mechanical', 'Administration', 'Computer', 'Electronics', 'Design'];
    let nameParts = [];
    for (let part of parts) {
        if (stopWords.includes(part)) break;
        nameParts.push(part);
    }
    let name = nameParts.join(' ').trim();

    if (!email.includes('@')) {
       email = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '@iiitdmj.ac.in';
    }

    let role = 'PROFESSOR';
    if (name.includes('Santosh Mahobia')) role = 'FIC';
    if (name.includes('Amrita')) role = 'SAC';
    if (name.includes('Yashpal')) role = 'MESS';

    try {
        await prisma.user.create({
            data: { username: email, password: hashedPassword, name: name, role: role }
        });
    } catch(e) {
        console.error('Error seeding staff:', email, e.message);
    }
  }

  console.log('Database seeded with PDF data successfully!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
