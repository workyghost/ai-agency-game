// AI Agency Tycoon - Game Content (Turkish Edition)
// Extracted and adapted from the AI Ajansı Framework PDF.

window.GAME_CONTENT = {
  // 1. LEVELS DEFINITION
  levels: [
    {
      id: 0,
      name: "Level 0: Temel Hazırlık (Faz 0)",
      duration: "Hafta 0",
      objective: "Lansman öncesi mali ve operasyonel altyapıyı eksiksiz şekilde kurmak.",
      educationalBrief: `AI Ajansı kurarken yapılan en büyük hatalardan biri hazırlıksız yola çıkmaktır. 30 müşteriyi yönetebilecek bir volume play (hacim oyunu) yapısı kurmak için "Template Thinking" (Şablon Kafası) zihniyetine geçmelisiniz. Her sürecin tekrarlanabilir, standart ve hızlı olması gerekir. Ayrıca yurtdışı müşterilerinden ödeme alabilmek için Stripe Atlas ve Wise Business altyapısını kurmalı, profilinizi İngilizceye çevirmelisiniz.`,
      instructions: [
        "En az 9 aylık temel giderlerinizi kapsayan bir acil durum rezervi oluşturun.",
        "Aylık $300-500 arası otomasyon ve yazılım araç bütçesi ayırın.",
        "LinkedIn ve web sitenizi tamamen İngilizceye (.com domain) çevirerek global pozisyonlama yapın.",
        "Stripe Atlas + Wise Business hesaplarınızı açarak uluslararası ödeme altyapısını hazır hale getirin.",
        "Zaman diliminizi Avrupa (EU) ve Amerika (US) saatlerine uyumlu (sabah 15:00 - 22:00 arası) olacak şekilde ayarlayın."
      ],
      checklist: [
        "9 aylık acil rezerv bankada hazır.",
        "Stripe Atlas + Wise Business hesabı aktif.",
        "LinkedIn profili EN, .com domain alındı.",
        "EN email imzası kuruldu.",
        "Yetenek denetimi (Skill Audit) yazılı olarak tamam.",
        "Onboarding + reporting şablonları boş olarak hazır.",
        "Aile/yakın çevre ile beklentiler konuşuldu."
      ],
      transitionCriteria: "Pre-launch kontrol listesindeki 7 maddeden en az 6'sı tamamlandığında ve 'Template Thinking' kafası yerleştiğinde bir sonraki faza geçebilirsiniz.",
      commonMistakes: [
        "Ödeme sistemini geciktirmek (Stripe/Wise olmadan global müşteri kapamazsınız).",
        "Hazırlıksız lansman yapmak ve nakit sıkışıklığı yaşamak.",
        "Süreçleri otomatize etmeden veya şablonlaştırmadan manuel yapmaya çalışmak."
      ],
      statsImpact: {
        startingCapacity: 5,
        baseSatisfaction: 80,
        initialBudget: 5000 // USD
      }
    },
    {
      id: 1,
      name: "Level 1: Niş Seçimi (Faz 1)",
      duration: "Hafta 1-2",
      objective: "Hacim oyununa uygun, şablonlaştırılması kolay tek bir dikey (niche) seçmek.",
      educationalBrief: `30 farklı sektörden 30 müşteri yönetmek imkansızdır. Başarılı bir AI ajansı için niş darlığı kritiktir. Aynı nişteki 30 müşteri için içerik şablonları %80 ortaktır. En mantıklı başlangıç noktası Yerel Hizmet (Local Service Businesses) sektörüdür (Terapi, fitness, diş kliniği, dil okulları). Bu sektörlerde şablon uyumu %85'tir ve müşteri edinimi hızlıdır.`,
      instructions: [
        "Tek bir dikey seçin (Örn: Yerel Hizmetler: Terapi klinikleri veya Spor salonları).",
        "Seçtiğiniz nişin hem TR hem de INT (global) pazarda aynı olmasını sağlayın (böylece operasyon tek kalır).",
        "Nişiniz için en az 200+ TR potansiyel müşteri ve 500+ INT potansiyel müşteri listesi (isim, mail, Instagram) hazırlayın."
      ],
      checklist: [
        "Tek bir dikey seçildi (örneğin Yerel Hizmet).",
        "Hem TR hem global için aynı niş belirlendi.",
        "200+ TR potansiyel müşteri listesi hazır.",
        "500+ INT potansiyel müşteri listesi hazır."
      ],
      transitionCriteria: "Tek bir dikey netleştiğinde, TR ve EN için hedef havuz oluşturulduğunda bir sonraki faza geçebilirsiniz.",
      commonMistakes: [
        "Çok dar niş seçmek (Örn: 'İstanbul'daki yoga stüdyoları' pazarı çok hızlı tüketir).",
        "Çok geniş niş seçmek (Örn: 'Küçük işletmeler' şablon uyumunu sıfırlar, her işi özel yapmak zorunda kalırsınız).",
        "TR ve INT için farklı nişler seçmek (operasyonel yükü iki katına çıkarır)."
      ],
      statsImpact: {
        templateMatchRate: 85, // %
        marketSizeTR: 200,
        marketSizeINT: 500
      }
    },
    {
      id: 2,
      name: "Level 2: Hizmet Tanımlama (Faz 2)",
      duration: "Hafta 2-3",
      objective: "Özelleştirilmiş (custom) işleri tamamen reddedip, standart paket ve 4 katmanlı fiyatlandırma oluşturmak.",
      educationalBrief: `Volume play modelinde her müşteriye özel saat harcayamazsınız. Standart paketimiz: 8 sosyal medya gönderisi (2 platform), yapay zeka ile üretilmiş caption, Canva şablonu görsel, otomatik aylık performans raporu, 3 ayda bir 30 dk strateji araması ve ilk ay para iade garantisidir. Premium katman ise sadece platform sayısını ve gönderi adedini artırır. Fiyatlandırma TR ve INT pazarları için optimize edilmiş 4 katmandan oluşur.`,
      instructions: [
        "Standard ve Premium olmak üzere iki hizmet paketi tanımlayın. Custom paket tekliflerini kesinlikle reddedin.",
        "TR Standart paketi 12.000 TL, TR Premium paketi 25.000 TL olarak belirleyin.",
        "INT Standart paketi $1.500-2.000, INT Premium paketi $2.500-3.500 olarak belirleyin.",
        "İlk 5-8 müşteri için masaya otururken kapı açıcı olan 'Money-Back Guarantee' (Para İade Garantisi) teklifini hazırlayın."
      ],
      checklist: [
        "Standart hizmet paketi içeriği yazılı olarak netleşti.",
        "TR ve EN dillerinde iki adet satış (landing) sayfası hazırlandı.",
        "4 katmanlı (4-tier) fiyatlandırma tablosu oluşturuldu.",
        "Para iade garantisi (Money-back guarantee) kuralları belirlendi."
      ],
      transitionCriteria: "Fiyatlandırma netleştiğinde, standart paket ile premium farkı kesinleştiğinde satış aşamasına geçmeye hazırsınız.",
      commonMistakes: [
        "Müşteri ısrar etti diye 'custom paket' yapmak (30 müşteri hedefini baştan öldürür).",
        "Para iade garantisi vermekten korkmak (güven bariyerini aşamazsınız).",
        "Hacim odaklı pazara girmeden çok yüksek fiyat çekmek."
      ],
      statsImpact: {
        standardPriceTR: 12000, // TRY
        standardPriceINT: 1500, // USD
        guaranteeOffered: true
      }
    },
    {
      id: 3,
      name: "Level 3: Outbound & Satış (Faz 3)",
      duration: "Hafta 3-12",
      objective: "Paralel TR ve INT cold outreach kanalları kurarak demo aramaları almak ve satış kapamak.",
      educationalBrief: `30 müşteriye 18 ayda ulaşmak için outbound sistemini otomatize etmelisiniz. Ayda ortalama 1.5 - 2 yeni müşteri kapatmak hedeftir. TR için Instagram ve LinkedIn DM (ayda 200-300 mesaj), INT için LinkedIn ve Apollo cold email (ayda 400-500 mesaj) kanallarını kullanın. Mesajlarda mutlaka 'Spesifik Gözlem -> Problem -> Çözüm -> Düşük Taahhütlü CTA' (Örn: '60 saniyelik ekran kaydı atayım mı?') formülünü uygulayın.`,
      instructions: [
        "TR cold outreach sistemini başlatın (günde 15-20 DM).",
        "INT için Lemlist üzerinde 3 adımlı (3-touch) otomatik e-posta sekansı kurun.",
        "Gelen yanıtları Calendly üzerinden 15 dakikalık standart 'Demo Call' aramalarına dönüştürün.",
        "Demo Call mini-oyununu oynayarak ilk müşterinizi kapatmaya çalışın!"
      ],
      checklist: [
        "Apollo ve LinkedIn Sales Navigator filtreleri hazır.",
        "Lemlist sekansı kuruldu ve çalışıyor.",
        "TR DM şablonları kişiselleştirilebilir formatta hazır.",
        "Calendly linki ve zaman dilimi ayarları tamam.",
        "İlk 10 demo araması takvime eklendi."
      ],
      transitionCriteria: "Yurtiçinde 4-6 müşteri, yurtdışında 2-4 müşteri imzalandığında ve outbound sistemi düzenli akışa geçtiğinde bu seviyeyi geçersiniz.",
      commonMistakes: [
        "Yetersiz hacim (Ayda sadece 50 mesaj atarsanız 30 müşteriye ulaşmanız 5 yıl sürer).",
        "Kişiselleştirilmemiş, spam (generic) mesajlar göndermek (yanıt oranı %1'in altına düşer).",
        "Sadece TR pazarına odaklanmak (TR'de fiyat tavanı düşüktir, $40K MRR hedefine sadece TR ile ulaşılamaz)."
      ],
      statsImpact: {
        monthlyOutreachTR: 250,
        monthlyOutreachINT: 450,
        averageCloseRate: 20 // %
      }
    },
    {
      id: 4,
      name: "Level 4: Operasyon & Otomasyon (Faz 4)",
      duration: "Hafta 4-12",
      objective: "Yapay zeka ve n8n/Make otomasyonları ile müşteri başına operasyon süresini haftalık 40 dakikaya indirmek.",
      educationalBrief: `30 müşteriyi solo yönetebilmenin tek yolu 'Extreme AI Leverage'dır. Eğer her müşteri için günde 1 saat harcarsanız haftada 30 saat sadece operasyona gider ve tükenirsiniz (burnout). Müşteri başına haftalık 40 dakika operasyon süresi hedeflemelisiniz. n8n/Make ile müşteri onboarding sürecini, içerik üretim döngüsünü, aylık raporlamayı ve faturalandırmayı otomatize etmelisiniz.`,
      instructions: [
        "Claude Pro veya Cowork kullanarak bulk (toplu) içerik üretimi yapın.",
        "Canva Pro Teams ile tasarım şablonlarını ve marka kitlerini hazırlayın.",
        "n8n veya Make üzerinde: Yeni müşteri formu -> Otomatik Notion sayfası + Canva klasörü otomasyonunu kurun.",
        "Metricool veya Hootsuite kullanarak 30 müşterinin bulk içerik planlamasını (scheduling) tek yerden yapın."
      ],
      checklist: [
        "10 adet caption (metin) ve 15 adet Canva tasarım şablonu kütüphanede hazır.",
        "Brand Voice AI asistan şablonu oluşturuldu.",
        "n8n onboarding otomasyonu çalışıyor.",
        "Otomatik raporlama sistemi entegre edildi.",
        "Stripe ve Paraşüt otomatik fatura hatırlatıcıları kuruldu."
      ],
      transitionCriteria: "Tüm operasyonel otomasyonlar kurulu olduğunda ve müşteri başına haftalık operasyon süresi 40 dakikanın altına düştüğünde seviyeyi geçersiniz.",
      commonMistakes: [
        "Şablon kütüphanesi kurmadan ölçeklenmeye çalışmak (15. müşteride tıkanırsınız).",
        "Brand Voice şablonu kullanmadan doğrudan jenerik AI çıktısı paylaşmak (müşteri 2 haftada fark edip ayrılır).",
        "Müşteri başına haftada 2 saatten fazla operasyon harcamak."
      ],
      statsImpact: {
        weeklyOperationalTimePerClient: 40, // minutes
        systemAutomationRate: 90 // %
      }
    },
    {
      id: 5,
      name: "Level 5: Delivery & Retention (Faz 5)",
      duration: "Ay 3-6",
      objective: "Müşteri kalış süresini (retention) 14+ aya çıkararak churn (kayıp) oranını minimize etmek.",
      educationalBrief: `Sosyal medya ajanslarında en kritik finansal metrik retention'dır. Ayda 2 müşteri kaybediyorsanız, büyümek için her ay en az 3 yeni müşteri bulmalısınız. Bu sürdürülemez bir döngüdür. Retention'ı artırmak için n8n ile otomatik aylık rapor gönderin. Standart müşterilerle her 3 ayda bir 30 dk, Premium müşterilerle ise her ay 30 dk durum değerlendirmesi (Strategy Call) yapın.`,
      instructions: [
        "Otomatik aylık performans raporlarını aksatmadan her ay sonu müşteriye e-posta ile ulaştırın.",
        "Her 3 ayda bir standart müşterilerle 30 dk arama yapıp işleri iyi gidiyorsa onları Premium paketine yükseltin (upsell).",
        "Müşteri kaybetme sinyallerini (onay gecikmesi 7+ gün, aramaya katılmama, ödeme gecikmesi) proaktif olarak takip edin."
      ],
      checklist: [
        "Aylık raporlama otomasyonu sıfır hata ile çalışıyor.",
        "Müşteri kaybetme sinyalleri (churn triggers) için Slack uyarı mekanizması kuruldu.",
        "Mevcut müşterilerin en az %15'i Premium pakete yükseltildi.",
        "Ortalama müşteri retention süresi 14 ayın üzerine çıktı."
      ],
      transitionCriteria: "En az 10 müşteri 3 ayı tamamladığında, aylık churn oranı %5'in altına düştüğünde ve ilk upsell satışı gerçekleştiğinde seviyeyi geçersiniz.",
      commonMistakes: [
        "Aylık raporları manuel hazırlamak (zaman kaybı).",
        "Müşterilerle strateji aramalarını aksatmak (müşteri kendini değersiz hisseder ve ayrılır).",
        "Ödeme gecikmelerini takip etmemek (2. gecikmeden sonra churn olasılığı %80'dir)."
      ],
      statsImpact: {
        averageRetentionMonths: 14,
        monthlyChurnRate: 4, // %
        upsellConversionRate: 25 // %
      }
    },
    {
      id: 6,
      name: "Level 6: Sanal Asistan & Ölçeklenme (Faz 6)",
      duration: "Ay 6-18",
      objective: "15+ müşteriye ulaşıldığında part-time Sanal Asistan (VA) işe alarak zaman özgürlüğü kazanmak ve 30 müşteriye koşmak.",
      educationalBrief: `15 müşteriyi geçtikten sonra solo olarak satış, operasyon ve stratejiyi yönetmek zorlaşır. Kalitenin düşmemesi için operasyonel işleri (scheduling, rapor veri toplama, basit müşteri iletişimi, Canva şablon düzenlemeleri) part-time bir Sanal Asistan'a (VA) devretmelisiniz. TR'den bir VA aylık $400-700, yurtdışından (Filipinler/Latin Amerika) bir VA ise $600-1.000 arası maliyete sahiptir.`,
      instructions: [
        "Müşteri sayısı 15'e ulaştığında part-time bir VA işe alım süreci başlatın.",
        "Asistanınıza 2 haftalık sıkı bir onboarding uygulayın; scheduling ve rapor hazırlama görevlerini devredin.",
        "Kritik içerik üretimini (bulk AI generation) ve stratejik kararları kesinlikle asistanınıza devretmeyin, bu sizin işinizdir.",
        "Haftalık zamanınızı 35 saatte tutarak asistanın 20 saatlik desteği ile 30 müşteriyi sürdürülebilir şekilde yönetin."
      ],
      checklist: [
        "VA iş tanımı ve standart operasyon prosedürleri (SOP) hazır.",
        "İlk part-time VA işe alındı ve onboarding süreci tamamlandı.",
        "Scheduling ve temel rapor veri toplama görevleri VA'e devredildi.",
        "Haftalık kişisel çalışma süresi 35 saatin altına düştü."
      ],
      transitionCriteria: "25-30 müşteriye ulaşıldığında, VA verimli şekilde çalıştığında ve MRR $35K-45K aralığına geldiğinde final seviyesine geçersiniz.",
      commonMistakes: [
        "15 müşteriyi aşmasına rağmen VA almamak (aşırı yorgunluk ve müşteri kaybı yaşanır).",
        "İçerik üretimini (content production) asistanın üzerine yıkmak (kalite düşer, stratejiyi asistan belirleyemez).",
        "Çok erken aşamada (22 müşteriden önce) pahalı full-time eleman alarak kar marjını eritmek."
      ],
      statsImpact: {
        personalWeeklyHours: 35,
        vaWeeklyHours: 20,
        vaCostUSD: 600
      }
    },
    {
      id: 7,
      name: "Level 7: Karar Anı (Faz 7)",
      duration: "Ay 18-24",
      objective: "$40K MRR hedefine ulaştıktan sonra ajansın geleceği için stratejik yönü belirlemek.",
      educationalBrief: `Tebrikler! 18-24 ay süren disiplinli çalışmanın ardından 30 müşteriye ve aylık $40.000 MRR hedefine ulaştınız. Artık önünüzde 3 stratejik yol var. Yol 1: Mevcut solo + VA yapısını koruyarak yüksek marjlı ve rahat bir hayat sürmek. Yol 2: Tam zamanlı çalışanlar alarak ajansı 60-80 müşteriye büyütmek. Yol 3: Elde ettiğiniz veri ve niş uzmanlığı ile ajansı bir yazılıma (SaaS) dönüştürmek (Mert'in önerisi).`,
      instructions: [
        "Ajansınızın mevcut finansal durumunu analiz edin ($40.000+ MRR ve %80+ kar marjı).",
        "Risk iştahınızı, ekip yönetme isteğinizi ve uzun vadeli hedeflerinizi değerlendirin.",
        "Üç yoldan birini seçerek oyunun finalini yapın ve ajans imparatorluğunuzu taçlandırın!"
      ],
      checklist: [
        "30 aktif müşteri ve $40K+ MRR başarısı tescillendi.",
        "Stratejik yol analizleri okundu.",
        "3 nihai gelecek yolundan biri seçildi."
      ],
      transitionCriteria: "Stratejik kararınızı verip seçimi onayladığınızda oyunu başarıyla tamamlamış olursunuz.",
      commonMistakes: [
        "Büyüme hedefleri olmadan kontrolsüzce eleman alıp nakit akışını bozmak.",
        "SaaS pivotunu pazar araştırması ve ajans nakit akışı desteği olmadan aceleye getirmek."
      ],
      statsImpact: {
        mrrUSD: 40000,
        profitMargin: 80 // %
      }
    }
  ],

  // 2. BADGES DEFINITION
  badges: [
    {
      id: "temel_hazir",
      icon: "🏆",
      name: "Temel Hazır",
      requirements: "Level 0: Temel Hazırlık aşamasını tüm checklist maddeleriyle tamamlayın.",
      description: "Mali rezervleri kurdunuz, Stripe Atlas/Wise ödeme altyapısını hazırladınız ve global pazara açılmak için İngilizce konumlandırmanızı yaptınız. İlk fırlatış için hazırsınız!"
    },
    {
      id: "yerel_fatih",
      icon: "🎯",
      name: "Yerel Fatih",
      requirements: "Yerel pazarda (TR) aynı nişte ilk 3 müşterinizi kazanın.",
      description: "Hacim oyununun ilk kurallarını kendi yerel pazarınızda test ettiniz. TR müşterilerinden elde ettiğiniz nakit akışı ve vaka analizleri (case studies) global satışlarınız için en büyük yakıt olacak."
    },
    {
      id: "otomasyon_sihirbazı",
      icon: "⚡",
      name: "Otomasyon Sihirbazı",
      requirements: "Level 4: n8n/Make üzerinde onboarding, içerik üretimi ve raporlama otomasyonlarını başarıyla kurun.",
      description: "Müşteri başına haftalık operasyon süresini 40 dakikanın altına indirdiniz. Artık 30 müşteriyi tek başınıza, kaliteyi düşürmeden yönetebilecek teknik altyapıya sahipsiniz."
    },
    {
      id: "kurt_satıcı",
      icon: "📞",
      name: "Kurt Satıcı",
      requirements: "15 dakikalık Demo Call mini-oyununu perfect (kusursuz) skorla (tüm adımlarda doğru kararlar vererek) tamamlayın.",
      description: "Selamlamadan keşfe, çözüm sunumundan fiyat ve garanti açıklamasına kadar tüm satış adımlarını profesyonelce yönettiniz. İtirazları anında kapattınız!"
    },
    {
      id: "global_oyuncu",
      icon: "👑",
      name: "Global Oyuncu",
      requirements: "Yurtdışı (INT) pazarında 10 aktif standart müşteriye ulaşarak $15.000 MRR barajını aşın.",
      description: "Artık gerçek bir global ajans sahibisiniz. Düşük hacimli TR pazarının ötesine geçip, yüksek marjlı ve döviz getiren global pazarda kalıcı bir yer edindiniz."
    },
    {
      id: "saas_visionary",
      icon: "🤖",
      name: "SaaS Visionary",
      requirements: "Level 7 karar anında 'Yol 3: Productized -> SaaS Pivot' seçeneğini belirleyerek ajansınızı yazılıma dönüştürün.",
      description: "Mert'in de tavsiye ettiği en akıllıca sonu seçtiniz. 30 müşteriden gelen niş uzmanlığı ve veriyle kendi yazılımınızı kurdunuz. $40K MRR ajans geliriyle SaaS'ı fonlayarak milyar dolarlık exit potansiyeline adım attınız!"
    }
  ],

  // 3. OUTBOUND MESSAGE TEMPLATES
  outboundTemplates: {
    title: "Outbound Mesaj Şablonları Analizi",
    description: "Volume play modelinde mesajlarımızın kişiselleştirilmiş (personalized) olması şarttır ancak aynı zamanda ölçeklenebilir (scalable) olmalıdır. Her mesajı yazmak maksimum 3 dakika sürmelidir.",
    templates: [
      {
        id: "generic_bad_tr",
        type: "Bad/Generic",
        language: "Türkçe",
        channel: "Instagram/LinkedIn DM",
        content: `Merhaba, biz yapay zeka tabanlı bir sosyal medya ajansıyız. Sosyal medya hesaplarınızı en son yapay zeka teknolojileriyle yönetebilir, takipçilerinizi artırabiliriz. Çok uygun fiyatlara çalışıyoruz. Detaylar için görüşmek ister misiniz?`,
        analysis: "Neden Başarısız? Kişiselleştirme sıfır. Müşterinin hesabına bakılmadığı belli. Teklif belirsiz ve değersiz. 'Çok ucuzuz' diyerek profesyonellikten uzak bir imaj çiziliyor. Spam klasörüne gider."
      },
      {
        id: "personalized_good_tr_1",
        type: "Good/Personalized",
        language: "Türkçe",
        channel: "Instagram DM (İlk Mesaj - Varyant 1)",
        content: `Merhaba [İSİM],

[İŞLETME]'nin Instagram'ına baktım — son 30 günde [X] gönderi paylaşılmış. Müşterilerinizin büyük kısmı Story'lerden veya keşfetten geliyor sanırım.

AI ile haftada 2 gönderi + aylık erişim raporu paketi yapıyorum. Benzer bir [NİŞ ÖRNEĞİ] için hazırladığım 60 saniyelik ekran kaydı analizim var — size de atayım mı?

İyi günler.`,
        analysis: "Neden Başarılı? İlk 10 saniyede spesifik bir gözlem var (son 30 günde X gönderi). Problem ve potansiyel müşteri kaynağı tahmin ediliyor. Düşük taahhütlü bir CTA ('60 saniyelik video atayım mı?') kullanılarak yanıt verme sürtünmesi düşürülüyor."
      },
      {
        id: "personalized_good_tr_2",
        type: "Good/Personalized",
        language: "Türkçe",
        channel: "Instagram DM (Takip Mesajı - 5 Gün Sonra)",
        content: `Selam [İSİM],

Geçen hafta yazmıştım, meşgul olabilirsiniz. Kısa bir özet geçmek istedim:

[İŞLETME] için aylık 8 gönderi + erişim raporu hazırlıyorum. Aylık fiyatımız [FİYAT] TL. İlk ay erişim oranınız taahhüt ettiğimiz düzeyde büyümezse paranız koşulsuz iade.

Bahsettiğim 60 saniyelik ekran kaydını atayım mı?`,
        analysis: "Neden Başarılı? Kısa ve kibar bir hatırlatma. Net standart fiyat belirtiliyor. 'Para iade garantisi' ile güven bariyeri tamamen yıkılıyor. CTA yine çok düşük sürtünmeli."
      },
      {
        id: "generic_bad_en",
        type: "Bad/Generic",
        language: "English",
        channel: "Cold Email",
        content: `Subject: AI Social Media Management Services

Hi, we are an AI marketing agency. We provide AI generated social media posts, design templates, and reporting. We can help you grow your brand online. Our rates are very competitive. Let me know if you want to hop on a call.`,
        analysis: "Why it fails? Standard spam email template. Subject line is generic and boring. No personalization, no research, high commitment CTA (asking for a call immediately before showing any value)."
      },
      {
        id: "personalized_good_en_1",
        type: "Good/Personalized",
        language: "English",
        channel: "Apollo Cold Email (First Touch - Variant 1)",
        content: `Subject: Quick idea for [BUSINESS] Instagram

Hi [NAME],

Looked at [BUSINESS]'s Instagram — saw you posted [X] times in the last 30 days. My guess is most of your new customers are still coming from referrals and search?

I run AI-powered social media for [NICHE] businesses — 8 posts/month, automated reporting, $1,500/mo. 

I made a quick 60-second screen recording showing how we did this for a similar [NICHE EXAMPLE] — can I send it over?

Best,
[YOUR NAME]`,
        analysis: "Why it works? Subject line is personal and high-open rate. Uses the exact PDF cold message formula (Observation -> Niche specific problem -> Standard $1500 offer -> 60-second recording CTA). Low friction."
      },
      {
        id: "personalized_good_en_2",
        type: "Good/Personalized",
        language: "English",
        channel: "Cold Email (Follow-up - Variant 2)",
        content: `Subject: Re: Quick idea for [BUSINESS] Instagram

Hey [NAME],

Sent a note last week — probably caught you busy. Quick recap:

AI-powered social for [BUSINESS] — 8 posts/mo, automated reach reports, $1,500/mo. 
Money-back guarantee if reach doesn't grow by X% in the first 30 days.

Send the 60-sec recording?

Best,
[YOUR NAME]`,
        analysis: "Why it works? Threaded follow-up. Reinforces the risk-free nature of the offer with the Money-back guarantee. Short, punchy, and keeps the CTA extremely simple."
      }
    ]
  },

  // 4. DEMO CALL DIALOG TREE
  demoCallDialog: {
    title: "15 Dakikalık Demo Call Satış Simülasyonu",
    description: "Müşterilerle yaptığınız 15 dakikalık standart keşif ve satış araması. Doğru adımları izlemek satışı kapatmanızı sağlar; yanlış adımlar (pazarlık yapmak, garanti vermemek, custom iş kabul etmek veya kaba davranmak) müşteriyi kaçırır.",
    startNode: "greeting",
    nodes: {
      // PHASE 1: GREETING (Dakika 0-2)
      greeting: {
        phase: "1. Tanışma ve Bağlam (0-2. Dakika)",
        customerStatement: "Merhaba! Toplantı talebiniz üzerine katıldım. Sosyal medya yönetimimiz hakkında görüşecektik sanırım. Açıkçası vaktim biraz kısıtlı.",
        choices: [
          {
            text: "Merhaba! Katıldığınız için teşekkürler. Evet, gönderdiğim Instagram inceleme videosundaki detaylar hakkında konuşacağız. 15 dakikalık süremiz var; ilk 5 dakika durumunuzu anlayacağım, sonra 5 dakika çözümü ve fiyatı sunacağım, son 5 dakikada ise sorularınızı yanıtlayacağız. Uygun mudur?",
            score: 10,
            nextNode: "discovery",
            feedback: "Mükemmel! Selamlamayı kısa tuttunuz, mesajdaki bağlamı doğruladınız ve 15 dakikalık yapılandırılmış süreyi (3 parça) belirterek kontrolü elinize aldınız. Müşteri profesyonelliğinizi takdir etti."
          },
          {
            text: "Merhaba! Harika bir gün. Ben yapay zeka araçları kullanarak firmaların sosyal medyasını uçuran bir ajansım. Size saatlerce sunum yapabilirim, isterseniz hemen slaytlarıma geçelim.",
            score: 2,
            nextNode: "discovery",
            feedback: "Orta seviye. Kendinizden çok bahsettiniz, 15 dakikalık süreyi yapılandırmadınız ve slayt sunumuyla müşteriyi sıkma riski yarattınız. Kontrol müşteride kalabilir."
          },
          {
            text: "Merhaba, hoş geldiniz. Aslında benim de vaktim çok kısıtlı ama sizi araya sıkıştırdım. Instagram hesabınız dökülüyor, çok kötü durumda. Bunu hemen düzeltmemiz lazım.",
            score: -10,
            nextNode: "fail_node",
            feedback: "Başarısız! Müşteriye karşı kibirli ve kaba davrandınız, empati kurmadınız. Müşteri profesyonellik dışı yaklaşımınız nedeniyle toplantıyı anında sonlandırdı."
          }
        ]
      },

      // PHASE 2: DISCOVERY (Dakika 2-5)
      discovery: {
        phase: "2. Acı Noktası Keşfi (2-5. Dakika)",
        customerStatement: "Evet, süre planlaması harika. Şu an sosyal medyamızı klinikteki asistanımız yönetmeye çalışıyor ama açıkçası çok zaman alıyor, gönderi kalitesi düşük ve ne yapacağımızı tam bilmiyoruz.",
        choices: [
          {
            text: "Çok iyi anlıyorum. Peki asistanınız şu an bu işe haftada kaç saat ayırıyor? Ve şu an sosyal medyanızda en çok çalışmayan, canınızı sıkan şey nedir? Son olarak, bu sorun çözülse işletmeniz ne kazanır?",
            score: 10,
            nextNode: "solution",
            feedback: "Harika! Tam olarak framework keşif sorularını sordunuz (Kim yönetiyor? Kaç saat gidiyor? Ne çalışmıyor? Çözülürse ne kazanılır?). Müşteri sorunun derinliğini kendi ağzıyla itiraf etti."
          },
          {
            text: "Zaman kaybı normal çünkü yapay zeka kullanmıyorsunuz. Biz hemen tüm hesaplarınızı devralıp her gün 5 post atabiliriz, hemen başlayalım mı?",
            score: 3,
            nextNode: "solution",
            feedback: "Aceleci davrandınız. Müşterinin mevcut operasyonunu ve asıl acı noktalarını tam keşfetmeden hemen çözüm satmaya çalıştınız. Müşteri aceleci tavrınızdan biraz rahatsız oldu."
          },
          {
            text: "Zaten asistanın işi bu değil ki, neden ona yaptırıyorsunuz? Bırakın biz yapalım, detayları boş verin.",
            score: -5,
            nextNode: "fail_node",
            feedback: "Müşterinin mevcut ekibini ve emeğini küçümsediniz, keşif yapmayı tamamen reddettiniz. Müşteri güven duymayarak görüşmeyi sonlandırdı."
          }
        ]
      },

      // PHASE 3: SOLUTION (Dakika 5-9)
      solution: {
        phase: "3. Çözüm Sunumu (5-9. Dakika)",
        customerStatement: "Asistanımız haftada en az 6 saat harcıyor ama aldığımız sonuç sıfır. Bize tam olarak nasıl bir çözüm sunuyorsunuz? Her gün sıfırdan içerik üretmek bizim için çok zor.",
        choices: [
          {
            text: "Sizin için ayda 8 adet platforma özel gönderi hazırlıyoruz. Brand Voice AI asistanınızla marka sesinizi bir kez tanımlayıp tüm içerikleri 1 saatte üretiyoruz. Eski yöntemle 6 saat süren işi, AI gücüyle 1.5 saatte kaliteyi bozmadan tamamlıyoruz. İşte benzer bir klinik için ürettiğimiz şu örnek postlar...",
            score: 10,
            nextNode: "pricing",
            feedback: "Mükemmel! Çözümü 3 cümlede özetlediniz, AI leverage avantajını (6 saat yerine 1.5 saat) açıkladınız ve sosyal kanıt/örnek post gösterdiniz. Müşteri sunumu çok net buldu."
          },
          {
            text: "Her işletmeye özel tamamen sıfırdan strateji yazıyoruz. Her gün post, hikayeler, videolar hazırlayacağız. Size özel bir grup kurup 7/24 iletişimde olacağız. İstediğiniz her şeyi değiştirebiliriz.",
            score: 1,
            nextNode: "pricing",
            feedback: "Hata! Tamamen 'custom' (özel) paket vadettiniz. Volume play modelinde custom paket yapmak operasyonel bir intihardır. 30 müşteriyi bu şekilde yönetemezsiniz. Müşteri sevindi ama siz kendi operasyonunuzu zora soktunuz."
          },
          {
            text: "Yapay zeka ile binlerce görsel ve metin üreteceğiz. Chatbotlar kuracağız, sitenizi de yapay zekaya yaptıracağız. Her şeyi otomatize edeceğiz.",
            score: -5,
            nextNode: "fail_node",
            feedback: "Çok karmaşık ve kapsam dışı teklifler sundunuz. Müşteri sosyal medya yönetimi isterken odağı dağıttınız, yapay zekayı bir sihir gibi anlatıp güven vermediniz. Müşteri çekildi."
          }
        ]
      },

      // PHASE 4: PRICING + GUARANTEE (Dakika 9-12)
      pricing: {
        phase: "4. Fiyat ve Garanti (9-12. Dakika)",
        customerStatement: "Kulağa gerçekten pratik geliyor, örnek tasarımlar da çok profesyonel. Peki bu hizmetin aylık maliyeti nedir ve size nasıl güvenebiliriz?",
        choices: [
          {
            text: "Standart paketimizin fiyatı aylık 1.500 Dolar. İlk ay için performans garantisi veriyoruz: Eğer ilk 30 günde sosyal medya erişiminiz taahhüt ettiğimiz oranda büyümezse, ödediğiniz ücreti kuruşu kuruşuna iade ediyoruz. Risk tamamen bize ait.",
            score: 10,
            nextNode: "objection",
            feedback: "Harika! Fiyatı net ve duraksamadan söylediniz. Money-back (para iade) garantisini açıkça belirterek müşterinin riskini sıfıra indirdiniz. Güven puanınız tavan yaptı."
          },
          {
            text: "Maliyet aslında bütçenize göre değişir ama normalde 2.000 Dolar alıyoruz. Size özel indirimle 1.800 Dolar yapabiliriz. Garanti vermiyoruz ama elimizden geleni yaparız.",
            score: 2,
            nextNode: "objection",
            feedback: "Zayıf. Fiyatı net söylemeyip hemen pazarlık yaptınız ve garanti vermeyerek risk algısını yüksek tuttunuz. Müşteri tereddüt ediyor ve pahalı buluyor."
          },
          {
            text: "Önce bir başlayalım, fiyatı ay sonunda konuşuruz. Aramızda paranın lafı olmaz, memnun kalırsanız gönlünüzden ne koparsa ödersiniz.",
            score: -10,
            nextNode: "fail_node",
            feedback: "Başarısız! Fiyatı saklamak ve sonraya bırakmak amatörlüktür. Ücretsiz iş yapma izlenimi verdiniz ve kurumsallıktan uzaklaştınız. Müşteri ciddiyetsiz bularak görüşmeyi bitirdi."
          }
        ]
      },

      // PHASE 5: OBJECTION HANDLING (Dakika 12-15)
      objection: {
        phase: "5. İtiraz Karşılama ve Kapanış (12-15. Dakika)",
        customerStatement: "Teklifiniz güzel ama fiyat biraz yüksek geldi. Bir de ortaklarımla görüşüp biraz düşünmem gerekiyor sanırım. Size e-posta ile dönsem olur mu?",
        choices: [
          {
            text: "Karar vermeden önce ortaklarınızın aklındaki soruları da doğrudan yanıtlamak isterim. İsterseniz yarın ortaklarınızın da katılacağı 15 dakikalık hızlı bir ortak arama yapalım, netleştirelim. Uygunsa sözleşmeyi hazırlayıp önümüzdeki Pazartesi başlayabiliriz, ne dersiniz?",
            score: 10,
            nextNode: "success_node",
            feedback: "Muazzam! 'Düşünmem lazım/Ortağımla konuşmam lazım' itirazını, ortağı da 15 dakikalık call'a davet ederek ve net bir başlangıç günü (Pazartesi) önererek mükemmel yönettiniz. Satış kapandı!"
          },
          {
            text: "Tabii ki düşünebilirsiniz. Fiyatımız piyasaya göre çok ucuz aslında ama karar sizin. Lütfen karar verince bana e-posta atın, bekliyorum.",
            score: 3,
            nextNode: "average_node",
            feedback: "Zayıf takip. Müşteriyi kendi haline bıraktınız ve kontrolü tamamen kaybettiniz. Takip araması veya net bir sonraki adım belirlemediniz. İleride kapanabilir ama ihtimal çok düşük."
          },
          {
            text: "Eğer bütçeniz yetersizse bunu en başta söyleyebilirdiniz. Bu kadar yapay zeka teknolojisine bu fiyat çok az bile, piyasadan haberiniz yok sanırım.",
            score: -15,
            nextNode: "fail_node",
            feedback: "Felaket! Müşteriyle tartışmaya girdiniz ve bütçesini küçümsediniz. Profesyonel imajınız tamamen yıkıldı, müşteri telefonu yüzünüze kapattı."
          }
        ]
      },

      // END NODES
      success_node: {
        isEnd: true,
        success: true,
        message: "Tebrikler! Görüşmeyi profesyonelce tamamladınız, riskleri sıfırladınız, itirazları doğru karşıladınız ve müşteriyi başarıyla kapattınız! 📞 Kurt Satıcı rozeti kazandınız!"
      },
      average_node: {
        isEnd: true,
        success: false,
        message: "Müşteri 'düşünüp size döneceğini' söyledi fakat net bir takip planı yapmadığınız için görüşme soğudu. Satış gerçekleşmedi. Tekrar deneyin!"
      },
      fail_node: {
        isEnd: true,
        success: false,
        message: "Görüşme başarısızlıkla sonuçlandı. Yanlış iletişim, belirsiz fiyat veya kaba yaklaşımlar nedeniyle müşteri masadan kalktı. Framework kurallarına sadık kalarak tekrar deneyin!"
      }
    }
  }
};
