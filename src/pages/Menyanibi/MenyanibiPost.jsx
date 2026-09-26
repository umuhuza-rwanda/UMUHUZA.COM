import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHeart, FiMessageCircle, FiEye } from "react-icons/fi";
import umurangaLogo from "../../assets/umuranga.logo/UMURANGA.COM.png";
import "./Menyanibi.css";

// =====================================================
// ALL REAL POSTS (Full Content)
// =====================================================
const posts = [
  {
    id: "1",
    title: "Dore ibimenyetso 10 bikwereka ko umukobwa akwiyumvamo",
    category: "Crush",
    likes: "1.8k",
    comments: "47",
    views: "12.4k",
    content: `1. Yumva mwahorana:
Nkuko hagati y’abantu bakundana bigenda, umukobwa ugukunda kandi ukwiyumvamo aba yumva iteka mwahorana, muganira.

2. Ashimishwa no kuganira nawe
Iyo muganira, aguha umwanya kandi akagaragaza ko ibiganiro mugirana bimushimisha kandi bimushishikaje.

3. Akwereka inshuti ze:
Ashobora kugushyira mu nshuti ze no kubabwira ibikwerekeyeho, ku buryo ushobora gusanga bamwe bakuzi mutaranahura.

4. Ashaka ko mujyana ahantu hatandukanye:
Ahora yifuza ko mujyana ahantu hamwe nko mu birori, kwizihiza iminsi mikuru cyangwa ahandi, kugira ngo mumarane igihe kandi umubano wanyu ukomere.

5. Ntabwo yishimira kukubona uri kumwe n’abandi bakobwa:
Iyo ubana neza n’abandi bakobwa, ashobora kugaragaza ko bitamushimisha. Ibi bishobora kuba ikimenyetso cy’uko agufata nk’umuntu wihariye.

6. Indoro:
Uburyo akurebamo bushobora kugaragaza ko akwiyumvamo cyangwa ko agufitiye inyota yo kukwegera.

7. Ibiganiro by’urukundo:
Kenshi iyo muganira akora uko ashoboye ngo muganire ibiganiro by’urukundo.

8. Umunsi w’amavuko
Umukobwa ukwiyumvamo aba azi byinshi bikwerekeyeho kugeza ku munsi wavukiyeho cyangwa indi minsi ifite icyo ivuze mu buzima bwawe.

9. Ni umufana wawe ukomeye
Ibintu byose ukora arabyishimira kandi akabikwereka.

10. Gukora ibikorwa bikureshya:
Ashobora kugerageza gukurura ibitekerezo byawe binyuze mu myambarire, inseko, uburyo avuga cyangwa ibindi bikorwa bituma umwitaho.`,
  },
  {
    id: "2",
    title: "Dore Ibintu 5 bikwereka ko uwo wita umukunzi atanagutekereza",
    category: "Warning",
    likes: "1.3k",
    comments: "38",
    views: "9.7k",
    content: `1. Ntaguha umwanya
Umukunzi wawe ashobora guhora akubwira ko ahuze ku buryo utabona umwanya uhagije wo kumubona, kuganira cyangwa kwishimana na we. Iyo ibi bihoraho, bishobora kuba ikimenyetso cy’uko ataguha umwanya ukwiye mu buzima bwe.

2. Akugereranya n’abandi
Ashobora guhora akugereranya n’uwo bahoze bakundana cyangwa n’abandi bahungu cyangwa abakobwa, ndetse rimwe na rimwe akavuga ko abandi ari beza cyangwa bafite ibyo bakurusha. Ibi bishobora gutuma wibaza niba koko agufata nk’umuntu wihariye.

3. Ntiyifuza kuganira ku hazaza hanyu
Umuntu ugukunda ashobora kugira inzozi z’uko muzabaho mu gihe kizaza, aho muzaba, umuryango muzagira n’ubuzima muzubaka. Iyo umukunzi wawe adashaka na gato kuganira kuri ibyo cyangwa ibiganiro nk’ibyo bikamubangamira, bishobora kuba ikimenyetso cyo kwitondera.

4. Ahora yivumbura cyangwa akarakara
Iyo umuntu atagufitiye amarangamutima, amakosa mato ashobora kumurakaza cyane. Ashobora guhora akwivumburaho cyangwa akarakazwa n’ibintu bidakomeye, bigatuma umubano wanyu urushaho kugorana.

5. Ntabwo aterwa ishema nawe
Ashobora kudashaka kukuvuga mu ruhame, kukwereka inshuti ze cyangwa kugendana nawe ku mugaragaro. Iyo umuntu ahora yirinda kugaragaza ko muri kumwe, bishobora gutuma wibaza uko abona umubano wanyu.`,
  },
  {
    id: "3",
    title: "IBINTU 5 BIKWEREKA KO UMUHUNGU MUKUNDANA ATAGUTENDEKA KANDI ATAKURYARYA",
    category: "Love",
    likes: "2.4k",
    comments: "61",
    views: "15.2k",
    content: `1. Akwereka inshuti n’abavandimwe be n’imiryango
Ni ikimenyetso cyiza iyo umusore mukundana atagutinya cyangwa ngo aguhishe inshuti ze, abavandimwe be ndetse n’abandi bo mu muryango we, cyane cyane iyo umubano wanyu ukomeje gukomera nubwo mutaratangira kubana.
Iyo akwemerera kumenya abantu be ba hafi kandi akabereka ko mukundana, bishobora kugaragaza ko nta kintu gikomeye aguhisha. Umuntu ushaka kuguhisha cyangwa ufite ibyo atakubwira ashobora kwirinda ko umenyana n’abantu be ba hafi kugira ngo batagira ibyo bakubwira cyangwa ngo bamubaze ibijyanye nawe.

2. Akubonamo umuntu udasimburwa
Umusore ugukunda kandi aguha agaciro akubonamo umuntu w’ingenzi mu buzima bwe. Ntakwitwara nk’aho ushobora gusimbuzwa n’undi muntu uwo ari we wese, ahubwo akakwereka ko agufata nk’umuntu wihariye.
Ibi bishobora kugaragarira mu buryo akwitaho, akubaha, akumva ibitekerezo byawe kandi akagushimira uruhare ugira mu buzima bwe. Iyo ahora akwereka ko uri umuntu w’agaciro kuri we, bishobora kuba ikimenyetso cy’uko umubano wanyu awufata nk’ikintu gikomeye.

3. Ntabwo iyo mugiranye ibibazo abitindaho cyane
Ni ibisanzwe ko abantu bakundana bagirana ibibazo cyangwa kutumvikana rimwe na rimwe. Icy’ingenzi ni uburyo buri wese ahitamo gukemura ibyo bibazo.
Umusore ugufata nk’umuntu w’ingenzi iyo mugiranye ikibazo ashaka inzira yo kugikemura neza aho kugikomeza cyangwa ngo akigire inzika. Ashobora kugerageza kukuganiriza, kumva uruhande rwawe no gushaka uko mwongera kubana neza.
Ibi bishobora kugaragaza ko adashaka ko ikibazo gito gihinduka impamvu yo gutandukana kandi ko aha agaciro umubano wanyu.

4. Aba ari kumwe nawe mu byiza no mu bibi
Umusore ugufata nk’umuntu w’ingenzi ntaba hafi yawe gusa iyo ibintu byose bigenda neza. Iyo uri mu bihe bikomeye cyangwa ubabaye, ashobora kugerageza kukuba hafi, kukwihanganisha no kugutera imbaraga.
Kuba hafi yawe mu bihe byiza no mu bihe bibi bigaragaza ko umubano wanyu atawubona nk’ikintu gishingiye ku byishimo gusa. Aba yiteguye gusangira nawe ibihe bitandukanye by’ubuzima kandi akumva ko kuba hafi yawe ari ingenzi.

5. Nta mikino agira, ibintu byose avuga aba abikomeje kandi ntacyo agukinga
Iyo umusore afatana uburemere umubano wanyu, ntabwo awufata nk’umukino. Agerageza kuba umunyakuri kuri wowe, akakubwiza ukuri kandi akirinda kugira ibintu by’ingenzi aguhisha.
Iyo atangiye kukugirira icyizere no kukubwira ibimuri ku mutima, bishobora kugaragaza ko abona ko uri umuntu wa hafi kandi w’ingenzi kuri we. Iyo kandi ibyo avuga bihura n’ibyo akora, bishobora kugufasha kumenya ko umubano wanyu awufata mu buryo bukomeye kandi ko atagushaka mu buryo bw’uburiganya.`,
  },
  {
    id: "4",
    title: "IBIMENYETSO BIKWEREKA KO UMUKUNZI WAWE ADAFITE IGITEKEREZO CYO KUBA YABANA NAWE",
    category: "Warning",
    likes: "3.1k",
    comments: "89",
    views: "18.6k",
    content: `Urukundo nyarwo ntirugaragarira mu magambo gusa, ahubwo rugaragarira no mu bikorwa, mu kwitaho no mu buryo umuntu ateganya ejo hazaza h’umubano we. Hari igihe umuntu ashobora kukubwira ko agukunda, ariko ibikorwa bye bikerekana ko atiteguye ko umubano wanyu ugera ku rwego rwo kubana.
Dore ibimenyetso 10 bishobora kugufasha kubimenya:

1. Amagambo ye ntahuza n’ibikorwa bye
Umuntu ashobora kukubwira ko agukunda cyane, ko uri uw’ingenzi mu buzima bwe cyangwa ko ashaka ko muzabana, ariko ibikorwa bye ntibigaragaze ibyo avuga.
Niba adashyira imbaraga mu mubano, atakwitaho mu bihe bikomeye kandi ntagerageze kubaka ejo hazaza hamwe nawe, bishobora kuba ikimenyetso cy’uko amagambo ye adahagije.

2. Aba hafi yawe iyo bimufitiye inyungu gusa
Umukunzi ushaka kubana nawe akwiye kuba hafi yawe atari uko hari icyo akeneye gusa. Niba ahora akwegera iyo akeneye amafaranga, ubufasha cyangwa ikindi kintu, ariko iyo ari wowe ukeneye ubufasha ntabe ahari, bishobora kugaragaza ko umubano wanyu utubakiye ku rukundo n’ubufatanye bihagije.

3. Yirinda ibiganiro byimbitse ku hazaza h’umubano wanyu
Iyo muganiriye ku rukundo rwanyu, ejo hazaza cyangwa ku bijyanye no kubana, ahora ahindura ikiganiro, akarakara cyangwa akakubwira ko ibyo bidakenewe.
Umuntu ushaka ko umubano ukomera akenshi aba ashobora kuganira nawe ku ntego zanyu, ibyifuzo byanyu ndetse n’uko abona ejo hazaza h’umubano wanyu.

4. Wiyumva uri wenyine nubwo muri kumwe
Hari igihe umuntu ashobora kuba afite umukunzi ariko akumva nta muntu afite umuba hafi. Niba utumva ko wumvwa, witabwaho cyangwa ngo ubone ko amarangamutima yawe ahawe agaciro, bishobora kuba ikimenyetso cy’uko umubano wanyu udafite ubusabane bukomeye.

5. Ntagushyiriraho igihe cyangwa imbaraga zihagije
Umubano ukomeye usaba igihe n’imbaraga. Niba ahora avuga ko ahuze, nta mwanya agushakira, adashaka kukubona cyangwa ngo agire icyo akora ngo umubano wanyu ukomeze, bishobora kugaragaza ko utari mu byo ashyira imbere.

6. Ntakubaha cyangwa akagusebya
Kubahana ni inkingi ikomeye y’umubano. Niba umukunzi wawe ahora akubwira amagambo akomeretsa, akagusebya, akakuvugaho nabi cyangwa akagutesha agaciro, ibyo bishobora kugaragaza ikibazo gikomeye mu buryo abona umubano wanyu.
Urukundo rufite intego yo kubaka ubuzima hamwe rugomba kujyana no kubahana.

7. Ntagushyira mu migambi ye y’ejo hazaza
Niba umukunzi wawe akora gahunda z’ejo hazaza ariko ntakubemo, cyangwa ntashake kumenya niba nawe uzaba uri muri izo gahunda, bishobora kuba ikimenyetso cy’uko atarimo gutekereza ku buzima bwanyu nk’ubuzima bw’abantu bazabana.
Iyo umuntu atekereza ku kubana n’uwo akunda, akenshi atangira kumuganiriza ku ntego, gahunda n’ibyo bifuza kugeraho bari hamwe.

8. Ntakwereka ko yifuza ko umubano wanyu utera imbere
Umubano ushobora gutangira neza ariko ukagera aho ugahora ku rwego rumwe. Niba igihe gihita ariko ntashake ko mugera ku yindi ntambwe, akirinda gufata imyanzuro ikomeye cyangwa akanga kuganira ku iterambere ry’umubano wanyu, bishobora kuba ikimenyetso cy’uko atariteguye kubana nawe.

9. Uhora usabwa gutegereza nta gisubizo gifatika
Niba igihe cyose umubajije ku hazaza h’umubano wanyu agusubiza ati “tuzabireba”, “igihe kizagera” cyangwa agakomeza gusubika ibiganiro by’ingenzi, bishobora gutuma umenya ko nta cyemezo gifatika afite.
Gutegereza ubwabyo ntabwo ari ikibazo, ariko iyo bihoraho kandi nta cyerekezo cyangwa gahunda igaragara, ni byiza gusuzuma neza aho umubano wanyu ugana.

10. Umutima wawe uhora ukumvisha ko hari ikitagenda neza
Rimwe na rimwe umuntu ashobora kumva ko hari ikibazo mu mubano nubwo adashobora guhita asobanura neza impamvu. Ushobora guhora ufite gushidikanya, guhangayika cyangwa kumva ko umukunzi wawe atari gukorana nawe mu kubaka ejo hazaza.
Ibyo byiyumvo ntibihita bisobanura ko umubano wanyu ari mubi, ariko bishobora kuba impamvu yo guhagarara gato, mukaganira ku byo buri wese ashaka ndetse mugasuzuma niba mufite icyerekezo kimwe.`,
  },
  {
    id: "5",
    title: "INGARUKA 5 ZO KURYAMANA N’UMUSORE MUKUNDANA MUTARASHINGA URUGO",
    category: "Warning",
    likes: "3.8k",
    comments: "112",
    views: "22.1k",
    content: `1. Umusore mwaryamanye ashobora kutagukumbura nka mbere
Iyo mwihutiriye gukora imibonano mpuzabitsina mutarashinga urugo, amatsiko n’icyifuzo yari afite bishobora kugabanuka kuko aba amaze kubona icyo yifuzaga. Ibi bishobora gutuma umubano uhinduka cyangwa umwe muri mwe akumva ko nta mpamvu yo gukomeza kuwushyiramo imbaraga nk’uko byari bimeze mbere.

2. Agaciro yaguhaga gashobora kugabanuka
Hari igihe umusore ashobora gukoresha amagambo cyangwa amayeri menshi kugira ngo yemerewe gukora imibonano mpuzabitsina. Iyo bimaze kuba, imyitwarire ye ishobora guhinduka kandi akagenda akwereka agaciro gake kurusha mbere.
Ni yo mpamvu ari ngombwa kutemera igitutu cyangwa amayeri y’umuntu ushaka ko mukora imibonano mpuzabitsina nk’ikimenyetso cy’urukundo.

3. Umubano ushingiye cyane ku mibonano mpuzabitsina ushobora kudakomera
Umubano ukomeye wubakwa n’ibirenze imibonano mpuzabitsina. Hakenerwa kumenyana, kubahana, gufashanya, kuganira no kugira icyerekezo kimwe.
Iyo imibonano mpuzabitsina iba ari yo shingiro ry’umubano, ikibazo gito gishobora kuwuhungabanya. Ni byiza kubanza kubaka urukundo n’ubwizerane, kugira ngo imibonano mpuzabitsina ibe igice cy’umubano aho kuba cyo kintu cy’ingenzi cyawugize.

4. Bishobora kugira ingaruka ku buzima bwawe bw’ahazaza
Iyo mwaryamanye hanyuma mugatandukana, bishobora kugusigira agahinda, kwicuza cyangwa igikomere cyo mu mutima. Ibyo bishobora no kugira ingaruka ku buryo uzongera kwiyumvamo umubano mushya.
Hari kandi ibyago byo gutwita mutabiteganyije, cyane cyane iyo mutafashe ingamba zo kubikumira. Ibi bishobora kuzana inshingano n’ibibazo mutari mwiteguye.

5. Bishobora gushyira ubuzima bwawe mu kaga
Imibonano mpuzabitsina idakingiye ishobora gutera ibyago byo kwandura indwara zandurira mu mibonano mpuzabitsina, harimo na VIH, ndetse no gutwita utabiteganyije.
Nubwo kuba mukundana bishobora gutuma wumva wizera umukunzi wawe, ntabwo byonyine bivuga ko mwembi mutandura indwara cyangwa ko nta zindi ngaruka zihari. Ni ngombwa gufata ibyemezo bibungabunga ubuzima n’ejo hazaza byawe.`,
  },
  {
    id: "6",
    title: "IBINTU 10 BIZAKWEREKA KO UMUKOBWA AGUKUNDA ARIKO YABUZE UKO ABIKUBWIRA",
    category: "Crush",
    likes: "2.7k",
    comments: "73",
    views: "14.8k",
    content: `1. Inseko
Umukobwa ugukunda akenshi yishimira kukubona unezerewe. Iyo muri kumwe ashobora guhora agusekera, akishimira ibiganiro byanyu ndetse agaseka n’ibyo muvugana, nk’uburyo bwo kukwereka ko yishimira kuba hafi yawe.

2. Akunda kukureba cyane
Umukobwa ushobora kuba agufitiye amarangamutima ashobora guhora ashaka kukureba, cyane cyane iyo muri kumwe cyangwa mwahuriye ahantu hamwe. Iyo muhuriye amaso, ashobora guhita areba ahandi kubera isoni cyangwa kugira ngo atagaragaza cyane ibyo yumva.

3. Ibimenyetso by’umubiri
Imyitwarire y’umubiri ishobora rimwe na rimwe kugaragaza uko umuntu yiyumva. Niba akunda kuba hafi yawe, kukwicara iruhande, kugukoraho mu buryo busanzwe cyangwa akajya akurebamo akajisho, bishobora kuba bimwe mu bimenyetso by’uko akwitaho mu buryo bwihariye.

4. Akunda kukuvuga
Iyo umukobwa akunda umuntu, ashobora kumuvuga kenshi mu biganiro agirana n’inshuti ze. Niba ibintu byinshi baganiraho abihuza nawe cyangwa agatanga ingero akoresheje ibyo wigeze gukora cyangwa kuvuga, bishobora kugaragaza ko ahora agutekerezaho.

5. Azagusaba ko musohokana
Ashobora gutangira kugusaba ko musohokana mwembi, nubwo mbere mwari musanzwe ari inshuti, abo mukorana cyangwa abo mwigana. Ibi bishobora kuba uburyo bwo gushaka umwanya wo kuganira nawe mwihereye kandi mukamenyana kurushaho.

6. Azakoresha uko ashoboye kugira ngo aguhore iruhande
Umukobwa ugufitiye amarangamutima ashobora gushaka kujya ahantu azi ko ushobora kuba uri. Ashobora gushaka umwanya wo kuba hafi yawe, kuganira nawe cyangwa kumarana nawe igihe, kabone nubwo yaba atabivuga mu buryo butaziguye.

7. Azakubwira ko akunda imico yawe
Iyo umukobwa atangiye kukubwira ko akunda uburyo useka, ijwi ryawe, imyambarire yawe, ubwitonzi bwawe cyangwa indi mico yawe, bishobora kuba uburyo bwo kukwereka ko hari ikintu cyihariye akubonamo.

8. Akwereka ko akwitayeho buri gihe
Ashobora kugushyigikira mu biganiro, akakunganira mu byo uvuga cyangwa akagerageza kukwereka ko ibitekerezo byawe bifite agaciro. Iyo muri kumwe n’abandi, ushobora kubona ko yita cyane ku byo uvuga no ku byo ukora.

9. Akunda kukugira inama z’ubuzima
Umukobwa ugufitiye amarangamutima ashobora kwita ku buzima bwawe n’iterambere ryawe. Ashobora kukugira inama ku byo gukora, ibyo kwirinda cyangwa uburyo wakwiteza imbere, kuko aba ashaka kubona ibintu bigenda neza kuri wowe.

10. Aragufuhira
Niba akunda kukubaza ku bandi bakobwa mugendana cyangwa akifuza kumenya umubano mufitanye, bishobora kuba ikimenyetso cy’uko akwitaho mu buryo bwihariye. Gufuha bishobora kubaho iyo umuntu atifuza gutakaza umuntu afitiye amarangamutima, nubwo bidahagije byonyine ngo hemezwe ko agukunda.`,
  },
  {
    id: "7",
    title: "IBIMENYETSO 6 BIKWEREKA KO UMUKOBWA MUKUNDANA ASHISHIKAJWE N’AMAFARANGA YAWE KURUTA URUKUNDO",
    category: "Warning",
    likes: "3.5k",
    comments: "95",
    views: "19.3k",
    content: `Hari igihe umuntu ashobora gukundwa kubera uwo ari we, imico ye n’uburyo yitwara, ariko hari n’igihe ubutunzi cyangwa amafaranga bishobora kuba ari byo bituma umuntu yitabwaho cyane. Niba wifuza kumenya niba umukunzi wawe agukunda by’ukuri cyangwa niba ashishikajwe cyane n’ibyo utunze, hari imyitwarire ushobora kwitondera.

1. Ntajya agushishikariza kwizigamira
Umukobwa ugukunda kandi yita ku hazaza hawe ashobora kugushishikariza gukoresha neza amafaranga, kwizigamira no gutegura ejo hazaza. Ariko niba icyo yitaho ari amafaranga umuha gusa, atitaye ku hazaza hawe cyangwa ku hazaza h’umubano wanyu, bishobora kuba ikimenyetso cyo kwitondera.

2. Gutumiza nta rutangira cyangwa gushaka kurya no kunywa atitaye ku biciro
Iyo musohokanye, niba ahora atumiza ibintu bihenze atitaye ku bushobozi bwawe cyangwa ku ngaruka bishobora kugira ku mufuka wawe, bishobora kugaragaza ko amafaranga yawe amushishikaza cyane kurusha uko yita ku mibereho yawe.

3. Agundira ibye cyangwa akomere ku bye
Umubano usaba ko abantu bafashanya. Niba ahora yiteze ko ari wowe ugomba gutanga no kwishyura ibintu byose, ariko we ntashake kugira uruhare na rumwe mu byo mufatanyamo, bishobora kuba ikimenyetso cy’uko ashishikajwe cyane no kwakira ibyo umuha.

4. Ahora ategereje kwakira cyangwa guhabwa
Umuntu ushishikajwe n’amafaranga ashobora guhora ategereje impano, amafaranga cyangwa ikindi kintu gifite agaciro kiva kuri wowe. Niba ibyo ari byo bimutera kukwegera cyangwa akabishyira imbere mu mubano, ni ngombwa kwibaza niba urukundo ari rwo shingiro ry’umubano wanyu.

5. Ntajya ashima ibyo umukorera byose
Iyo umukunzi wawe aha agaciro urukundo n’imbaraga umushyiriramo, akenshi agaragaza ko abishimira. Ariko niba ibyo umukorera byose abifata nk’inshingano yawe, ntashime cyangwa ngo agaragaze ko abona agaciro kabyo, bishobora kuba ikimenyetso cyo kwitondera.

6. Hari n’abandi bagabo bamuha impano kandi zihenze
Niba umukunzi wawe ahora yakira impano zihenze cyangwa amafaranga atangwa n’abandi bagabo, kandi na we agakomeza kugutegaho impano n’ibindi bintu by’agaciro, bishobora gutuma wibaza niba ibyo ashaka cyane ari urukundo rwawe cyangwa inyungu ziva ku mafaranga yawe.`,
  },
  {
    id: "8",
    title: "AMAGAMBO MEZA 10 WABWIRA UMUKUNZI WAWE MBERE YO KUJYA KURYAMA",
    category: "Love",
    likes: "2.1k",
    comments: "54",
    views: "11.5k",
    content: `1.
Nta wundi muntu nifuza kuba ndi kumwe na we muri aka kanya utari wowe. Ndifuza ko twagumana, nkagukunda kandi nkakwifuriza ijoro ryiza.

2.
Muri ubu butumwa, nguhaye urukundo rwanjye rwose. Ndifuza ko mba hafi yawe, nkaguhobera kandi nkakwereka uko ngukunda.

3.
Ndifuza ko twakomeza kuganira kugeza nijoro ritinze, tutarambirwa. Kuganira nawe ni kimwe mu bintu bintera ibyishimo.

4.
Nifuzaga ko umenya ko uri umuntu w’agaciro kuri njye kandi ko ngukunda cyane. Nkwifurije kugira ijoro ryiza kandi rituje.

5.
Kimwe mu bihe nkunda buri munsi ni igihe tuganira mbere y’uko njya kuryama. Iyo tuganira, uranshimisha kandi ukatuma umunsi urangira neza.

6.
Sinishimira kuba kure yawe, kandi mpora ntegereje igihe nzongera kukubona. Menya ko ngukunda cyane. Ijoro ryiza, mukundwa wanjye.

7.
Nubwo uru ari urugendo rushya kuri twe, nizera ko ejo hazaza hazatubera heza. Uri umwe mu bantu bazamura amarangamutima yanjye kandi nkishimira kuba nkiri kumwe nawe.

8.
Ngiye kuryama, ariko ibitekerezo byanjye biri kuri wowe. Icyo nifuza cyane ni ukuzongera kukubona no kuba hafi yawe.

9.
Nubwo inzozi ari zo zonyine zishobora gutuma nkubona nkiri kure yawe, nzikunda kuko zimpesha amahirwe yo kukubona. Ijoro ryiza, shenge wanjye.

10.
Ndifuza ko wamenya ko uri umuntu wa nyuma ntekerezaho mbere yo gusinzira. Kandi iyo mbyutse, nifuza ko uba ukiri mu bitekerezo byanjye. Ndagukunda.

Niba ufite umukunzi, ushobora kumwifuriza ijoro ryiza ukoresheje rimwe muri aya magambo kugira ngo aryame azi ko umutekerezaho kandi umwitayeho.`,
  },
  {
    id: "9",
    title: "AMAGAMBO 15 MEZA WABWIRA UMUKOBWA UKUNDA",
    category: "Love",
    likes: "2.9k",
    comments: "68",
    views: "16.4k",
    content: `1.
Kuba uri mu buzima bwanjye byanyeretse ko urukundo rw’ukuri rubaho.

2.
Kuva twahura, ubuzima bwanjye bwarahindutse. Warampinduye mu buryo bwiza.

3.
Nkukundira uwo uri we ndetse n’uwo mba we iyo turi kumwe.

4.
Nkukunda uyu munsi, nzagukunda ejo, kandi nzakomeza kugukunda.

5.
Sinigeze ntekereza ko nakwibona umuntu umeze nkawe. Numva mfite amahirwe kuba narakubonye.

6.
Ibihe byiza kurusha ibindi ni ibyo mara ndi kumwe nawe.

7.
Iyo ntekereje ku byishimo mfite, wowe uhita uza mu bitekerezo byanjye.

8.
Iyo mbarura imigisha mfite, kuba narakumenye biri mu by’ingenzi kuri njye.

9.
Nishimira cyane kuba nshobora kukwita umukobwa nkunda kandi w’agaciro kuri njye.

10.
Iyo ndebye ibyiza biri ku isi, nibuka ko mfite umuntu umeze nkawe unzanira ibyishimo.

11.
Uri umuntu wihariye kuri njye, kandi nta wundi ushobora gusimbura umwanya ufite mu buzima bwanjye.

12.
Kukugira mu buzima bwanjye bituma menya ko mfite umuntu nshobora kwizera no kuganiriza.

13.
Iyo ndi kumwe nawe, numva mfite amahoro n’ibyishimo byihariye.

14.
Nta kindi kintu nifuza kurusha gukomeza kubaka ibihe byiza ndi kumwe nawe.

15.
Ndagukunda kandi nishimira buri mwanya mbona wo kuba hafi yawe.`,
  },
];

function MenyanibiPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="menyanibi-page">
        <div className="menyanibi-empty">
          <h2>Post not found</h2>
          <button className="back-btn" onClick={() => navigate("/menyanibi")}>
            ← Back to Menyanibi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menyanibi-page">
      {/* Header */}
      <div className="menyanibi-header">
        <button className="back-btn" onClick={() => navigate("/menyanibi")}>
          <FiArrowLeft /> Back
        </button>
        <div className="menyanibi-logo">
          <img src={umurangaLogo} alt="UMUHUZA" style={{ height: 36 }} />
        </div>
      </div>

      {/* Post */}
      <div className="menyanibi-post">
        <span className={`post-tag ${post.category.toLowerCase()}`}>
          {post.category}
        </span>

        <h1>{post.title}</h1>

        <div className="post-engagement">
          <span><FiHeart /> {post.likes}</span>
          <span><FiMessageCircle /> {post.comments}</span>
          <span><FiEye /> {post.views}</span>
        </div>

        <div className="post-content full-text">
          {post.content.split("\n").map((line, index) => (
            <p key={index} style={{ marginBottom: line.trim() === "" ? 12 : 6 }}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenyanibiPost;