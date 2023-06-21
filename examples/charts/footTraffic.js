import { c2mChart } from "../../dist/index.mjs";

let ref = null;

const data = [
    {
        date: "December 31, 2018",
        Costco: 580101,
        "Cub Foods": 14173,
        "H-E-B": 253551,
        "Hy-Vee": 49958,
        Kroger: 459632,
        Meijer: 141092,
        Safeway: 76531
    },
    {
        date: "January 7, 2019",
        Costco: 584229,
        "Cub Foods": 13815,
        "H-E-B": 250320,
        "Hy-Vee": 48795,
        Kroger: 447072,
        Meijer: 133117,
        Safeway: 73360
    },
    {
        date: "January 14, 2019",
        Costco: 572387,
        "Cub Foods": 13738,
        "H-E-B": 248493,
        "Hy-Vee": 51646,
        Kroger: 451195,
        Meijer: 137118,
        Safeway: 72272
    },
    {
        date: "January 21, 2019",
        Costco: 591131,
        "Cub Foods": 14323,
        "H-E-B": 249270,
        "Hy-Vee": 48811,
        Kroger: 449928,
        Meijer: 137078,
        Safeway: 72268
    },
    {
        date: "January 28, 2019",
        Costco: 556755,
        "Cub Foods": 14673,
        "H-E-B": 256256,
        "Hy-Vee": 50646,
        Kroger: 460265,
        Meijer: 132546,
        Safeway: 75962
    },
    {
        date: "February 4, 2019",
        Costco: 554079,
        "Cub Foods": 12318,
        "H-E-B": 232393,
        "Hy-Vee": 44748,
        Kroger: 416834,
        Meijer: 122967,
        Safeway: 71235
    },
    {
        date: "February 11, 2019",
        Costco: 586200,
        "Cub Foods": 13993,
        "H-E-B": 242881,
        "Hy-Vee": 51250,
        Kroger: 463045,
        Meijer: 133139,
        Safeway: 77680
    },
    {
        date: "February 18, 2019",
        Costco: 617378,
        "Cub Foods": 15083,
        "H-E-B": 250980,
        "Hy-Vee": 52007,
        Kroger: 465895,
        Meijer: 137272,
        Safeway: 75830
    },
    {
        date: "February 25, 2019",
        Costco: 618924,
        "Cub Foods": 14394,
        "H-E-B": 250231,
        "Hy-Vee": 50364,
        Kroger: 457727,
        Meijer: 137660,
        Safeway: 74790
    },
    {
        date: "March 4, 2019",
        Costco: 587729,
        "Cub Foods": 14973,
        "H-E-B": 244057,
        "Hy-Vee": 48626,
        Kroger: 447236,
        Meijer: 135695,
        Safeway: 74588
    },
    {
        date: "March 11, 2019",
        Costco: 612802,
        "Cub Foods": 14038,
        "H-E-B": 245457,
        "Hy-Vee": 49551,
        Kroger: 447089,
        Meijer: 144358,
        Safeway: 76020
    },
    {
        date: "March 18, 2019",
        Costco: 620947,
        "Cub Foods": 14487,
        "H-E-B": 253698,
        "Hy-Vee": 51724,
        Kroger: 468682,
        Meijer: 139800,
        Safeway: 77919
    },
    {
        date: "March 25, 2019",
        Costco: 601206,
        "Cub Foods": 13383,
        "H-E-B": 244897,
        "Hy-Vee": 51787,
        Kroger: 449556,
        Meijer: 132788,
        Safeway: 74997
    },
    {
        date: "April 1, 2019",
        Costco: 633513,
        "Cub Foods": 15145,
        "H-E-B": 263168,
        "Hy-Vee": 52482,
        Kroger: 466573,
        Meijer: 137997,
        Safeway: 77376
    },
    {
        date: "April 8, 2019",
        Costco: 631437,
        "Cub Foods": 16576,
        "H-E-B": 273590,
        "Hy-Vee": 56641,
        Kroger: 487270,
        Meijer: 152028,
        Safeway: 79884
    },
    {
        date: "April 15, 2019",
        Costco: 642405,
        "Cub Foods": 17758,
        "H-E-B": 269478,
        "Hy-Vee": 62364,
        Kroger: 546184,
        Meijer: 179712,
        Safeway: 89099
    },
    {
        date: "April 22, 2019",
        Costco: 683640,
        "Cub Foods": 15975,
        "H-E-B": 273228,
        "Hy-Vee": 56364,
        Kroger: 528768,
        Meijer: 151052,
        Safeway: 80857
    },
    {
        date: "April 29, 2019",
        Costco: 675268,
        "Cub Foods": 16170,
        "H-E-B": 278956,
        "Hy-Vee": 62106,
        Kroger: 529450,
        Meijer: 151893,
        Safeway: 85858
    },
    {
        date: "May 6, 2019",
        Costco: 710297,
        "Cub Foods": 18028,
        "H-E-B": 316862,
        "Hy-Vee": 66132,
        Kroger: 559499,
        Meijer: 172202,
        Safeway: 93419
    },
    {
        date: "May 13, 2019",
        Costco: 668971,
        "Cub Foods": 17410,
        "H-E-B": 292473,
        "Hy-Vee": 61435,
        Kroger: 539389,
        Meijer: 174454,
        Safeway: 85808
    },
    {
        date: "May 20, 2019",
        Costco: 684808,
        "Cub Foods": 16956,
        "H-E-B": 273009,
        "Hy-Vee": 62363,
        Kroger: 523051,
        Meijer: 173152,
        Safeway: 86911
    },
    {
        date: "May 27, 2019",
        Costco: 606190,
        "Cub Foods": 16467,
        "H-E-B": 283312,
        "Hy-Vee": 60956,
        Kroger: 525141,
        Meijer: 166366,
        Safeway: 86649
    },
    {
        date: "June 3, 2019",
        Costco: 676346,
        "Cub Foods": 17730,
        "H-E-B": 283989,
        "Hy-Vee": 58897,
        Kroger: 525304,
        Meijer: 167193,
        Safeway: 88348
    },
    {
        date: "June 10, 2019",
        Costco: 664101,
        "Cub Foods": 16493,
        "H-E-B": 281561,
        "Hy-Vee": 59045,
        Kroger: 526829,
        Meijer: 171478,
        Safeway: 88624
    },
    {
        date: "June 17, 2019",
        Costco: 650063,
        "Cub Foods": 16794,
        "H-E-B": 277053,
        "Hy-Vee": 58648,
        Kroger: 523815,
        Meijer: 166585,
        Safeway: 86443
    },
    {
        date: "June 24, 2019",
        Costco: 632599,
        "Cub Foods": 14647,
        "H-E-B": 235057,
        "Hy-Vee": 54107,
        Kroger: 467268,
        Meijer: 145782,
        Safeway: 83312
    },
    {
        date: "July 1, 2019",
        Costco: 606770,
        "Cub Foods": 15374,
        "H-E-B": 258112,
        "Hy-Vee": 57137,
        Kroger: 498039,
        Meijer: 163794,
        Safeway: 93586
    },
    {
        date: "July 8, 2019",
        Costco: 607865,
        "Cub Foods": 14547,
        "H-E-B": 244687,
        "Hy-Vee": 52353,
        Kroger: 476100,
        Meijer: 145424,
        Safeway: 84754
    },
    {
        date: "July 15, 2019",
        Costco: 613846,
        "Cub Foods": 14387,
        "H-E-B": 239800,
        "Hy-Vee": 52831,
        Kroger: 477676,
        Meijer: 152185,
        Safeway: 85568
    },
    {
        date: "July 22, 2019",
        Costco: 605397,
        "Cub Foods": 14230,
        "H-E-B": 239155,
        "Hy-Vee": 51186,
        Kroger: 467545,
        Meijer: 145190,
        Safeway: 86360
    },
    {
        date: "July 29, 2019",
        Costco: 606271,
        "Cub Foods": 14347,
        "H-E-B": 245183,
        "Hy-Vee": 52147,
        Kroger: 488960,
        Meijer: 149571,
        Safeway: 87471
    },
    {
        date: "August 5, 2019",
        Costco: 660707,
        "Cub Foods": 14663,
        "H-E-B": 250728,
        "Hy-Vee": 53551,
        Kroger: 521491,
        Meijer: 152747,
        Safeway: 86610
    },
    {
        date: "August 12, 2019",
        Costco: 667443,
        "Cub Foods": 14505,
        "H-E-B": 260973,
        "Hy-Vee": 54726,
        Kroger: 553312,
        Meijer: 162240,
        Safeway: 86840
    },
    {
        date: "August 19, 2019",
        Costco: 661517,
        "Cub Foods": 14930,
        "H-E-B": 257355,
        "Hy-Vee": 55430,
        Kroger: 549969,
        Meijer: 158225,
        Safeway: 86850
    },
    {
        date: "August 26, 2019",
        Costco: 679286,
        "Cub Foods": 14593,
        "H-E-B": 257100,
        "Hy-Vee": 55754,
        Kroger: 556395,
        Meijer: 156895,
        Safeway: 90568
    },
    {
        date: "September 2, 2019",
        Costco: 611499,
        "Cub Foods": 16028,
        "H-E-B": 279005,
        "Hy-Vee": 59620,
        Kroger: 598427,
        Meijer: 161473,
        Safeway: 92308
    },
    {
        date: "September 9, 2019",
        Costco: 652947,
        "Cub Foods": 15048,
        "H-E-B": 268828,
        "Hy-Vee": 57971,
        Kroger: 563252,
        Meijer: 155909,
        Safeway: 89850
    },
    {
        date: "September 16, 2019",
        Costco: 645270,
        "Cub Foods": 14745,
        "H-E-B": 261426,
        "Hy-Vee": 56779,
        Kroger: 558030,
        Meijer: 147676,
        Safeway: 87582
    },
    {
        date: "September 23, 2019",
        Costco: 641597,
        "Cub Foods": 14679,
        "H-E-B": 252576,
        "Hy-Vee": 56924,
        Kroger: 538984,
        Meijer: 145056,
        Safeway: 85739
    },
    {
        date: "September 30, 2019",
        Costco: 644188,
        "Cub Foods": 14718,
        "H-E-B": 254859,
        "Hy-Vee": 54992,
        Kroger: 526214,
        Meijer: 143709,
        Safeway: 85219
    },
    {
        date: "October 7, 2019",
        Costco: 611545,
        "Cub Foods": 13940,
        "H-E-B": 245780,
        "Hy-Vee": 53492,
        Kroger: 469991,
        Meijer: 144786,
        Safeway: 82537
    },
    {
        date: "October 14, 2019",
        Costco: 629502,
        "Cub Foods": 13558,
        "H-E-B": 254683,
        "Hy-Vee": 54779,
        Kroger: 486494,
        Meijer: 144326,
        Safeway: 84487
    },
    {
        date: "October 21, 2019",
        Costco: 630227,
        "Cub Foods": 14309,
        "H-E-B": 251722,
        "Hy-Vee": 56422,
        Kroger: 479078,
        Meijer: 147605,
        Safeway: 84312
    },
    {
        date: "October 28, 2019",
        Costco: 650040,
        "Cub Foods": 14138,
        "H-E-B": 259062,
        "Hy-Vee": 55689,
        Kroger: 487560,
        Meijer: 154068,
        Safeway: 84590
    },
    {
        date: "November 4, 2019",
        Costco: 665534,
        "Cub Foods": 14094,
        "H-E-B": 257067,
        "Hy-Vee": 55992,
        Kroger: 481960,
        Meijer: 149237,
        Safeway: 84129
    },
    {
        date: "November 11, 2019",
        Costco: 698075,
        "Cub Foods": 14266,
        "H-E-B": 267106,
        "Hy-Vee": 57933,
        Kroger: 496688,
        Meijer: 159281,
        Safeway: 85802
    },
    {
        date: "November 18, 2019",
        Costco: 741616,
        "Cub Foods": 15161,
        "H-E-B": 274222,
        "Hy-Vee": 59375,
        Kroger: 508274,
        Meijer: 164959,
        Safeway: 89266
    },
    {
        date: "November 25, 2019",
        Costco: 792434,
        "Cub Foods": 17646,
        "H-E-B": 298714,
        "Hy-Vee": 62784,
        Kroger: 564637,
        Meijer: 212632,
        Safeway: 100581
    },
    {
        date: "December 2, 2019",
        Costco: 722727,
        "Cub Foods": 14940,
        "H-E-B": 263840,
        "Hy-Vee": 58184,
        Kroger: 503968,
        Meijer: 170048,
        Safeway: 88232
    },
    {
        date: "December 9, 2019",
        Costco: 768651,
        "Cub Foods": 15472,
        "H-E-B": 270993,
        "Hy-Vee": 61505,
        Kroger: 529569,
        Meijer: 184454,
        Safeway: 92467
    },
    {
        date: "December 16, 2019",
        Costco: 891412,
        "Cub Foods": 17632,
        "H-E-B": 289550,
        "Hy-Vee": 67147,
        Kroger: 585028,
        Meijer: 215255,
        Safeway: 102561
    },
    {
        date: "December 23, 2019",
        Costco: 711535,
        "Cub Foods": 15831,
        "H-E-B": 283134,
        "Hy-Vee": 62869,
        Kroger: 553454,
        Meijer: 192634,
        Safeway: 108249
    },
    {
        date: "December 30, 2019",
        Costco: 851253,
        "Cub Foods": 22713,
        "H-E-B": 382610,
        "Hy-Vee": 77576,
        Kroger: 719382,
        Meijer: 248040,
        Safeway: 118994
    },
    {
        date: "January 6, 2020",
        Costco: 828557,
        "Cub Foods": 20706,
        "H-E-B": 373096,
        "Hy-Vee": 74332,
        Kroger: 686936,
        Meijer: 229399,
        Safeway: 111437
    },
    {
        date: "January 13, 2020",
        Costco: 758804,
        "Cub Foods": 20174,
        "H-E-B": 353126,
        "Hy-Vee": 70556,
        Kroger: 650653,
        Meijer: 215310,
        Safeway: 107091
    },
    {
        date: "January 20, 2020",
        Costco: 741636,
        "Cub Foods": 18265,
        "H-E-B": 330449,
        "Hy-Vee": 66395,
        Kroger: 618677,
        Meijer: 191318,
        Safeway: 101441
    },
    {
        date: "January 27, 2020",
        Costco: 716748,
        "Cub Foods": 18788,
        "H-E-B": 343149,
        "Hy-Vee": 73227,
        Kroger: 644531,
        Meijer: 195531,
        Safeway: 146166
    },
    {
        date: "February 3, 2020",
        Costco: 677866,
        "Cub Foods": 15459,
        "H-E-B": 309314,
        "Hy-Vee": 59453,
        Kroger: 569975,
        Meijer: 172470,
        Safeway: 142579
    },
    {
        date: "February 10, 2020",
        Costco: 678345,
        "Cub Foods": 16138,
        "H-E-B": 321626,
        "Hy-Vee": 63255,
        Kroger: 594406,
        Meijer: 184681,
        Safeway: 152823
    },
    {
        date: "February 17, 2020",
        Costco: 683486,
        "Cub Foods": 15508,
        "H-E-B": 296503,
        "Hy-Vee": 59113,
        Kroger: 550842,
        Meijer: 172535,
        Safeway: 142557
    },
    {
        date: "February 24, 2020",
        Costco: 769627,
        "Cub Foods": 16745,
        "H-E-B": 306200,
        "Hy-Vee": 60302,
        Kroger: 556682,
        Meijer: 185406,
        Safeway: 148062
    },
    {
        date: "March 2, 2020",
        Costco: 757274,
        "Cub Foods": 15464,
        "H-E-B": 298220,
        "Hy-Vee": 59722,
        Kroger: 563124,
        Meijer: 173915,
        Safeway: 147088
    },
    {
        date: "March 9, 2020",
        Costco: 841246,
        "Cub Foods": 21004,
        "H-E-B": 344584,
        "Hy-Vee": 67146,
        Kroger: 666984,
        Meijer: 216847,
        Safeway: 174328
    },
    {
        date: "March 16, 2020",
        Costco: 576793,
        "Cub Foods": 18821,
        "H-E-B": 288473,
        "Hy-Vee": 59130,
        Kroger: 591505,
        Meijer: 198051,
        Safeway: 147668
    },
    {
        date: "March 23, 2020",
        Costco: 489376,
        "Cub Foods": 16404,
        "H-E-B": 236517,
        "Hy-Vee": 52079,
        Kroger: 494749,
        Meijer: 166229,
        Safeway: 126171
    },
    {
        date: "March 30, 2020",
        Costco: 465454,
        "Cub Foods": 14723,
        "H-E-B": 227168,
        "Hy-Vee": 53348,
        Kroger: 494963,
        Meijer: 159846,
        Safeway: 118659
    },
    {
        date: "April 6, 2020",
        Costco: 381599,
        "Cub Foods": 14290,
        "H-E-B": 194272,
        "Hy-Vee": 53097,
        Kroger: 468454,
        Meijer: 154269,
        Safeway: 118129
    },
    {
        date: "April 13, 2020",
        Costco: 452753,
        "Cub Foods": 13666,
        "H-E-B": 202391,
        "Hy-Vee": 50115,
        Kroger: 435999,
        Meijer: 136406,
        Safeway: 104925
    },
    {
        date: "April 20, 2020",
        Costco: 493190,
        "Cub Foods": 14738,
        "H-E-B": 213726,
        "Hy-Vee": 53008,
        Kroger: 466779,
        Meijer: 155108,
        Safeway: 111232
    },
    {
        date: "April 27, 2020",
        Costco: 523174,
        "Cub Foods": 14714,
        "H-E-B": 229378,
        "Hy-Vee": 53206,
        Kroger: 475659,
        Meijer: 158063,
        Safeway: 113981
    },
    {
        date: "May 4, 2020",
        Costco: 531826,
        "Cub Foods": 16490,
        "H-E-B": 257714,
        "Hy-Vee": 59524,
        Kroger: 529922,
        Meijer: 179812,
        Safeway: 130464
    },
    {
        date: "May 11, 2020",
        Costco: 510003,
        "Cub Foods": 14700,
        "H-E-B": 242847,
        "Hy-Vee": 52436,
        Kroger: 485123,
        Meijer: 165101,
        Safeway: 111961
    },
    {
        date: "May 18, 2020",
        Costco: 554532,
        "Cub Foods": 15217,
        "H-E-B": 249822,
        "Hy-Vee": 56215,
        Kroger: 511762,
        Meijer: 180613,
        Safeway: 122232
    },
    {
        date: "May 25, 2020",
        Costco: 496019,
        "Cub Foods": 15727,
        "H-E-B": 257111,
        "Hy-Vee": 56511,
        Kroger: 510284,
        Meijer: 181630,
        Safeway: 120559
    },
    {
        date: "June 1, 2020",
        Costco: 572672,
        "Cub Foods": 15825,
        "H-E-B": 266011,
        "Hy-Vee": 59710,
        Kroger: 527211,
        Meijer: 189581,
        Safeway: 127139
    },
    {
        date: "June 8, 2020",
        Costco: 581027,
        "Cub Foods": 15444,
        "H-E-B": 264442,
        "Hy-Vee": 55694,
        Kroger: 510468,
        Meijer: 183714,
        Safeway: 123290
    },
    {
        date: "June 15, 2020",
        Costco: 573379,
        "Cub Foods": 15727,
        "H-E-B": 273633,
        "Hy-Vee": 58241,
        Kroger: 521612,
        Meijer: 190098,
        Safeway: 128832
    },
    {
        date: "June 22, 2020",
        Costco: 626335,
        "Cub Foods": 16754,
        "H-E-B": 274645,
        "Hy-Vee": 56803,
        Kroger: 527841,
        Meijer: 200424,
        Safeway: 127475
    },
    {
        date: "June 29, 2020",
        Costco: 576340,
        "Cub Foods": 17164,
        "H-E-B": 270838,
        "Hy-Vee": 61472,
        Kroger: 547961,
        Meijer: 208638,
        Safeway: 137179
    },
    {
        date: "July 6, 2020",
        Costco: 582889,
        "Cub Foods": 15314,
        "H-E-B": 255676,
        "Hy-Vee": 54868,
        Kroger: 510847,
        Meijer: 188936,
        Safeway: 122780
    },
    {
        date: "July 13, 2020",
        Costco: 586280,
        "Cub Foods": 15717,
        "H-E-B": 260874,
        "Hy-Vee": 56393,
        Kroger: 511252,
        Meijer: 192655,
        Safeway: 124523
    },
    {
        date: "July 20, 2020",
        Costco: 599084,
        "Cub Foods": 15674,
        "H-E-B": 261293,
        "Hy-Vee": 57691,
        Kroger: 523106,
        Meijer: 193048,
        Safeway: 126105
    },
    {
        date: "July 27, 2020",
        Costco: 583984,
        "Cub Foods": 15790,
        "H-E-B": 260512,
        "Hy-Vee": 57010,
        Kroger: 544846,
        Meijer: 196458,
        Safeway: 126794
    },
    {
        date: "August 3, 2020",
        Costco: 622692,
        "Cub Foods": 16295,
        "H-E-B": 265481,
        "Hy-Vee": 56492,
        Kroger: 526511,
        Meijer: 194744,
        Safeway: 126258
    },
    {
        date: "August 10, 2020",
        Costco: 626295,
        "Cub Foods": 16461,
        "H-E-B": 273634,
        "Hy-Vee": 62257,
        Kroger: 537118,
        Meijer: 198915,
        Safeway: 126478
    },
    {
        date: "August 17, 2020",
        Costco: 637652,
        "Cub Foods": 16887,
        "H-E-B": 292635,
        "Hy-Vee": 62416,
        Kroger: 549478,
        Meijer: 207932,
        Safeway: 129064
    },
    {
        date: "August 24, 2020",
        Costco: 580962,
        "Cub Foods": 16063,
        "H-E-B": 267010,
        "Hy-Vee": 55454,
        Kroger: 499504,
        Meijer: 190248,
        Safeway: 116148
    },
    {
        date: "August 31, 2020",
        Costco: 624723,
        "Cub Foods": 16032,
        "H-E-B": 282880,
        "Hy-Vee": 60791,
        Kroger: 535737,
        Meijer: 198182,
        Safeway: 129892
    },
    {
        date: "September 7, 2020",
        Costco: 547700,
        "Cub Foods": 16741,
        "H-E-B": 291822,
        "Hy-Vee": 60850,
        Kroger: 544089,
        Meijer: 197754,
        Safeway: 127350
    },
    {
        date: "September 14, 2020",
        Costco: 561527,
        "Cub Foods": 14541,
        "H-E-B": 263310,
        "Hy-Vee": 54445,
        Kroger: 493784,
        Meijer: 171172,
        Safeway: 114434
    },
    {
        date: "September 21, 2020",
        Costco: 576791,
        "Cub Foods": 15402,
        "H-E-B": 264096,
        "Hy-Vee": 56172,
        Kroger: 490148,
        Meijer: 180447,
        Safeway: 116513
    },
    {
        date: "September 28, 2020",
        Costco: 604987,
        "Cub Foods": 15946,
        "H-E-B": 272911,
        "Hy-Vee": 58911,
        Kroger: 520463,
        Meijer: 190232,
        Safeway: 118122
    },
    {
        date: "October 5, 2020",
        Costco: 591880,
        "Cub Foods": 15450,
        "H-E-B": 277778,
        "Hy-Vee": 57576,
        Kroger: 514584,
        Meijer: 177279,
        Safeway: 118661
    },
    {
        date: "October 12, 2020",
        Costco: 610845,
        "Cub Foods": 15380,
        "H-E-B": 282092,
        "Hy-Vee": 58847,
        Kroger: 525539,
        Meijer: 184753,
        Safeway: 117711
    },
    {
        date: "October 19, 2020",
        Costco: 623556,
        "Cub Foods": 15635,
        "H-E-B": 273016,
        "Hy-Vee": 60234,
        Kroger: 520424,
        Meijer: 187014,
        Safeway: 118035
    },
    {
        date: "October 26, 2020",
        Costco: 640305,
        "Cub Foods": 14901,
        "H-E-B": 279894,
        "Hy-Vee": 57037,
        Kroger: 521874,
        Meijer: 185767,
        Safeway: 116931
    },
    {
        date: "November 2, 2020",
        Costco: 600389,
        "Cub Foods": 13468,
        "H-E-B": 256097,
        "Hy-Vee": 53736,
        Kroger: 481640,
        Meijer: 159938,
        Safeway: 109397
    },
    {
        date: "November 9, 2020",
        Costco: 660993,
        "Cub Foods": 13767,
        "H-E-B": 265035,
        "Hy-Vee": 56446,
        Kroger: 494556,
        Meijer: 178991,
        Safeway: 109616
    },
    {
        date: "November 16, 2020",
        Costco: 684184,
        "Cub Foods": 14638,
        "H-E-B": 267728,
        "Hy-Vee": 56777,
        Kroger: 505348,
        Meijer: 178589,
        Safeway: 112690
    },
    {
        date: "November 23, 2020",
        Costco: 597474,
        "Cub Foods": 15235,
        "H-E-B": 272010,
        "Hy-Vee": 56977,
        Kroger: 514794,
        Meijer: 192775,
        Safeway: 118987
    },
    {
        date: "November 30, 2020",
        Costco: 648675,
        "Cub Foods": 14748,
        "H-E-B": 264592,
        "Hy-Vee": 56527,
        Kroger: 506259,
        Meijer: 194524,
        Safeway: 109687
    },
    {
        date: "December 7, 2020",
        Costco: 645370,
        "Cub Foods": 14818,
        "H-E-B": 261478,
        "Hy-Vee": 55405,
        Kroger: 505374,
        Meijer: 200569,
        Safeway: 110046
    },
    {
        date: "December 14, 2020",
        Costco: 684415,
        "Cub Foods": 15235,
        "H-E-B": 265707,
        "Hy-Vee": 58998,
        Kroger: 524747,
        Meijer: 219532,
        Safeway: 114246
    },
    {
        date: "December 21, 2020",
        Costco: 586175,
        "Cub Foods": 13874,
        "H-E-B": 267597,
        "Hy-Vee": 58375,
        Kroger: 506003,
        Meijer: 200351,
        Safeway: 124502
    },
    {
        date: "December 28, 2020",
        Costco: 600132,
        "Cub Foods": 15470,
        "H-E-B": 296146,
        "Hy-Vee": 60929,
        Kroger: 546750,
        Meijer: 196994,
        Safeway: 120117
    },
    {
        date: "January 4, 2021",
        Costco: 612074,
        "Cub Foods": 14208,
        "H-E-B": 277400,
        "Hy-Vee": 56889,
        Kroger: 512295,
        Meijer: 181660,
        Safeway: 111131
    },
    {
        date: "January 11, 2021",
        Costco: 567502,
        "Cub Foods": 13378,
        "H-E-B": 260288,
        "Hy-Vee": 53289,
        Kroger: 488864,
        Meijer: 170035,
        Safeway: 106126
    },
    {
        date: "January 18, 2021",
        Costco: 539451,
        "Cub Foods": 12387,
        "H-E-B": 252708,
        "Hy-Vee": 54311,
        Kroger: 465123,
        Meijer: 152536,
        Safeway: 112828
    },
    {
        date: "January 25, 2021",
        Costco: 504499,
        "Cub Foods": 11824,
        "H-E-B": 238018,
        "Hy-Vee": 50599,
        Kroger: 444269,
        Meijer: 147472,
        Safeway: 102610
    },
    {
        date: "February 1, 2021",
        Costco: 541668,
        "Cub Foods": 13289,
        "H-E-B": 260956,
        "Hy-Vee": 57270,
        Kroger: 476436,
        Meijer: 154241,
        Safeway: 108660
    },
    {
        date: "February 8, 2021",
        Costco: 524892,
        "Cub Foods": 12659,
        "H-E-B": 284806,
        "Hy-Vee": 53925,
        Kroger: 528234,
        Meijer: 159403,
        Safeway: 112831
    },
    {
        date: "February 15, 2021",
        Costco: 530625,
        "Cub Foods": 12548,
        "H-E-B": 215322,
        "Hy-Vee": 54436,
        Kroger: 469729,
        Meijer: 146948,
        Safeway: 106643
    },
    {
        date: "February 22, 2021",
        Costco: 556767,
        "Cub Foods": 12529,
        "H-E-B": 269340,
        "Hy-Vee": 56406,
        Kroger: 465435,
        Meijer: 151481,
        Safeway: 105604
    },
    {
        date: "March 1, 2021",
        Costco: 545292,
        "Cub Foods": 13119,
        "H-E-B": 256275,
        "Hy-Vee": 57569,
        Kroger: 465647,
        Meijer: 156359,
        Safeway: 110574
    },
    {
        date: "March 8, 2021",
        Costco: 559156,
        "Cub Foods": 12828,
        "H-E-B": 253895,
        "Hy-Vee": 56004,
        Kroger: 470673,
        Meijer: 154532,
        Safeway: 110211
    },
    {
        date: "March 15, 2021",
        Costco: 568933,
        "Cub Foods": 12748,
        "H-E-B": 256042,
        "Hy-Vee": 56484,
        Kroger: 473174,
        Meijer: 158344,
        Safeway: 111988
    },
    {
        date: "March 22, 2021",
        Costco: 548425,
        "Cub Foods": 12370,
        "H-E-B": 254515,
        "Hy-Vee": 56100,
        Kroger: 469760,
        Meijer: 155202,
        Safeway: 108976
    },
    {
        date: "March 29, 2021",
        Costco: 519169,
        "Cub Foods": 14488,
        "H-E-B": 252470,
        "Hy-Vee": 65074,
        Kroger: 527864,
        Meijer: 176125,
        Safeway: 125128
    },
    {
        date: "April 5, 2021",
        Costco: 557478,
        "Cub Foods": 13514,
        "H-E-B": 261829,
        "Hy-Vee": 59111,
        Kroger: 476755,
        Meijer: 155081,
        Safeway: 112029
    },
    {
        date: "April 12, 2021",
        Costco: 577594,
        "Cub Foods": 13156,
        "H-E-B": 259114,
        "Hy-Vee": 59889,
        Kroger: 481229,
        Meijer: 156893,
        Safeway: 113966
    },
    {
        date: "April 19, 2021",
        Costco: 558327,
        "Cub Foods": 13247,
        "H-E-B": 257380,
        "Hy-Vee": 58865,
        Kroger: 478480,
        Meijer: 158370,
        Safeway: 111409
    },
    {
        date: "April 26, 2021",
        Costco: 562408,
        "Cub Foods": 13334,
        "H-E-B": 264610,
        "Hy-Vee": 59747,
        Kroger: 487742,
        Meijer: 161706,
        Safeway: 115785
    },
    {
        date: "May 3, 2021",
        Costco: 599185,
        "Cub Foods": 14740,
        "H-E-B": 285838,
        "Hy-Vee": 65423,
        Kroger: 534564,
        Meijer: 177627,
        Safeway: 131183
    },
    {
        date: "May 10, 2021",
        Costco: 572383,
        "Cub Foods": 13744,
        "H-E-B": 276691,
        "Hy-Vee": 61697,
        Kroger: 501887,
        Meijer: 174660,
        Safeway: 120379
    },
    {
        date: "May 17, 2021",
        Costco: 587705,
        "Cub Foods": 14076,
        "H-E-B": 276040,
        "Hy-Vee": 61525,
        Kroger: 498730,
        Meijer: 174953,
        Safeway: 120599
    },
    {
        date: "May 24, 2021",
        Costco: 592495,
        "Cub Foods": 14121,
        "H-E-B": 290898,
        "Hy-Vee": 63870,
        Kroger: 513985,
        Meijer: 176301,
        Safeway: 126147
    },
    {
        date: "May 31, 2021",
        Costco: 525984,
        "Cub Foods": 14514,
        "H-E-B": 297247,
        "Hy-Vee": 64938,
        Kroger: 510001,
        Meijer: 174875,
        Safeway: 128364
    },
    {
        date: "June 7, 2021",
        Costco: 557418,
        "Cub Foods": 13575,
        "H-E-B": 269957,
        "Hy-Vee": 60211,
        Kroger: 474755,
        Meijer: 166964,
        Safeway: 119610
    },
    {
        date: "June 14, 2021",
        Costco: 558023,
        "Cub Foods": 13943,
        "H-E-B": 291397,
        "Hy-Vee": 62795,
        Kroger: 502520,
        Meijer: 179091,
        Safeway: 127999
    },
    {
        date: "June 21, 2021",
        Costco: 568317,
        "Cub Foods": 13611,
        "H-E-B": 283648,
        "Hy-Vee": 60362,
        Kroger: 478103,
        Meijer: 166693,
        Safeway: 123770
    },
    {
        date: "June 28, 2021",
        Costco: 527359,
        "Cub Foods": 14600,
        "H-E-B": 298931,
        "Hy-Vee": 67121,
        Kroger: 520322,
        Meijer: 182940,
        Safeway: 134953
    },
    {
        date: "July 5, 2021",
        Costco: 574911,
        "Cub Foods": 13520,
        "H-E-B": 282152,
        "Hy-Vee": 60902,
        Kroger: 489204,
        Meijer: 172581,
        Safeway: 121494
    },
    {
        date: "July 12, 2021",
        Costco: 559233,
        "Cub Foods": 13722,
        "H-E-B": 283995,
        "Hy-Vee": 60541,
        Kroger: 490584,
        Meijer: 174706,
        Safeway: 123515
    },
    {
        date: "July 19, 2021",
        Costco: 554706,
        "Cub Foods": 13713,
        "H-E-B": 278054,
        "Hy-Vee": 61226,
        Kroger: 481400,
        Meijer: 169418,
        Safeway: 122078
    },
    {
        date: "July 26, 2021",
        Costco: 536434,
        "Cub Foods": 13545,
        "H-E-B": 277348,
        "Hy-Vee": 61064,
        Kroger: 486999,
        Meijer: 165644,
        Safeway: 121945
    },
    {
        date: "August 2, 2021",
        Costco: 581427,
        "Cub Foods": 12666,
        "H-E-B": 278210,
        "Hy-Vee": 59098,
        Kroger: 480841,
        Meijer: 159031,
        Safeway: 118564
    },
    {
        date: "August 9, 2021",
        Costco: 581644,
        "Cub Foods": 13023,
        "H-E-B": 285424,
        "Hy-Vee": 61516,
        Kroger: 492806,
        Meijer: 163913,
        Safeway: 119702
    },
    {
        date: "August 16, 2021",
        Costco: 574254,
        "Cub Foods": 12938,
        "H-E-B": 291106,
        "Hy-Vee": 62088,
        Kroger: 489943,
        Meijer: 166832,
        Safeway: 117231
    },
    {
        date: "August 23, 2021",
        Costco: 558473,
        "Cub Foods": 12847,
        "H-E-B": 279098,
        "Hy-Vee": 60790,
        Kroger: 483829,
        Meijer: 165675,
        Safeway: 116271
    },
    {
        date: "August 30, 2021",
        Costco: 573048,
        "Cub Foods": 12690,
        "H-E-B": 284854,
        "Hy-Vee": 62316,
        Kroger: 492946,
        Meijer: 159355,
        Safeway: 120489
    },
    {
        date: "September 6, 2021",
        Costco: 493950,
        "Cub Foods": 12950,
        "H-E-B": 292746,
        "Hy-Vee": 61594,
        Kroger: 493978,
        Meijer: 158182,
        Safeway: 119635
    },
    {
        date: "September 13, 2021",
        Costco: 537212,
        "Cub Foods": 12065,
        "H-E-B": 270481,
        "Hy-Vee": 57955,
        Kroger: 463032,
        Meijer: 147422,
        Safeway: 114025
    },
    {
        date: "September 20, 2021",
        Costco: 548977,
        "Cub Foods": 12260,
        "H-E-B": 270527,
        "Hy-Vee": 59735,
        Kroger: 467361,
        Meijer: 149777,
        Safeway: 115706
    },
    {
        date: "September 27, 2021",
        Costco: 552189,
        "Cub Foods": 12170,
        "H-E-B": 272980,
        "Hy-Vee": 60194,
        Kroger: 471079,
        Meijer: 151651,
        Safeway: 114708
    },
    {
        date: "October 4, 2021",
        Costco: 548018,
        "Cub Foods": 12200,
        "H-E-B": 270233,
        "Hy-Vee": 59075,
        Kroger: 456294,
        Meijer: 149324,
        Safeway: 113525
    },
    {
        date: "October 11, 2021",
        Costco: 579955,
        "Cub Foods": 12530,
        "H-E-B": 284251,
        "Hy-Vee": 59944,
        Kroger: 477996,
        Meijer: 155802,
        Safeway: 115854
    },
    {
        date: "October 18, 2021",
        Costco: 583453,
        "Cub Foods": 12510,
        "H-E-B": 275912,
        "Hy-Vee": 60137,
        Kroger: 470053,
        Meijer: 155215,
        Safeway: 116161
    },
    {
        date: "October 25, 2021",
        Costco: 587293,
        "Cub Foods": 12905,
        "H-E-B": 279221,
        "Hy-Vee": 62417,
        Kroger: 480775,
        Meijer: 164235,
        Safeway: 118253
    },
    {
        date: "November 1, 2021",
        Costco: 600665,
        "Cub Foods": 12596,
        "H-E-B": 282048,
        "Hy-Vee": 61799,
        Kroger: 471055,
        Meijer: 153558,
        Safeway: 115554
    },
    {
        date: "November 8, 2021",
        Costco: 623024,
        "Cub Foods": 12954,
        "H-E-B": 281594,
        "Hy-Vee": 64519,
        Kroger: 476858,
        Meijer: 165654,
        Safeway: 118162
    },
    {
        date: "November 15, 2021",
        Costco: 668571,
        "Cub Foods": 14187,
        "H-E-B": 302256,
        "Hy-Vee": 66526,
        Kroger: 509847,
        Meijer: 174047,
        Safeway: 124948
    },
    {
        date: "November 22, 2021",
        Costco: 662017,
        "Cub Foods": 15853,
        "H-E-B": 314303,
        "Hy-Vee": 70870,
        Kroger: 550906,
        Meijer: 204100,
        Safeway: 138112
    },
    {
        date: "November 29, 2021",
        Costco: 613023,
        "Cub Foods": 12437,
        "H-E-B": 288323,
        "Hy-Vee": 62535,
        Kroger: 568490,
        Meijer: 167774,
        Safeway: 189611
    },
    {
        date: "December 6, 2021",
        Costco: 609724,
        "Cub Foods": 12094,
        "H-E-B": 278901,
        "Hy-Vee": 60501,
        Kroger: 551775,
        Meijer: 166667,
        Safeway: 182774
    },
    {
        date: "December 13, 2021",
        Costco: 678530,
        "Cub Foods": 13467,
        "H-E-B": 295478,
        "Hy-Vee": 66445,
        Kroger: 605938,
        Meijer: 197131,
        Safeway: 200325
    },
    {
        date: "December 20, 2021",
        Costco: 629073,
        "Cub Foods": 14140,
        "H-E-B": 305087,
        "Hy-Vee": 68524,
        Kroger: 619932,
        Meijer: 208812,
        Safeway: 221419
    },
    {
        date: "December 27, 2021",
        Costco: 581811,
        "Cub Foods": 13578,
        "H-E-B": 322851,
        "Hy-Vee": 68330,
        Kroger: 618986,
        Meijer: 182352,
        Safeway: 206077
    },
    {
        date: "January 3, 2022",
        Costco: 595108,
        "Cub Foods": 12658,
        "H-E-B": 305404,
        "Hy-Vee": 62927,
        Kroger: 593161,
        Meijer: 161828,
        Safeway: 195294
    },
    {
        date: "January 10, 2022",
        Costco: 572453,
        "Cub Foods": 12588,
        "H-E-B": 297988,
        "Hy-Vee": 61786,
        Kroger: 599687,
        Meijer: 162609,
        Safeway: 198535
    },
    {
        date: "January 17, 2022",
        Costco: 576219,
        "Cub Foods": 12215,
        "H-E-B": 299280,
        "Hy-Vee": 61519,
        Kroger: 565571,
        Meijer: 156810,
        Safeway: 193064
    },
    {
        date: "January 24, 2022",
        Costco: 553023,
        "Cub Foods": 11860,
        "H-E-B": 281483,
        "Hy-Vee": 62647,
        Kroger: 566597,
        Meijer: 155812,
        Safeway: 187535
    },
    {
        date: "January 31, 2022",
        Costco: 575508,
        "Cub Foods": 11975,
        "H-E-B": 307681,
        "Hy-Vee": 61931,
        Kroger: 590397,
        Meijer: 159493,
        Safeway: 189997
    },
    {
        date: "February 7, 2022",
        Costco: 589089,
        "Cub Foods": 13946,
        "H-E-B": 326770,
        "Hy-Vee": 68714,
        Kroger: 618449,
        Meijer: 171320,
        Safeway: 209704
    },
    {
        date: "February 14, 2022",
        Costco: 555258,
        "Cub Foods": 12315,
        "H-E-B": 297662,
        "Hy-Vee": 63217,
        Kroger: 564512,
        Meijer: 151121,
        Safeway: 195146
    },
    {
        date: "February 21, 2022",
        Costco: 604236,
        "Cub Foods": 12099,
        "H-E-B": 299972,
        "Hy-Vee": 63140,
        Kroger: 563612,
        Meijer: 154926,
        Safeway: 191283
    },
    {
        date: "February 28, 2022",
        Costco: 590766,
        "Cub Foods": 12082,
        "H-E-B": 284088,
        "Hy-Vee": 63625,
        Kroger: 562428,
        Meijer: 209031,
        Safeway: 195732
    },
    {
        date: "March 7, 2022",
        Costco: 612568,
        "Cub Foods": 12187,
        "H-E-B": 284612,
        "Hy-Vee": 61421,
        Kroger: 563242,
        Meijer: 210774,
        Safeway: 193452
    },
    {
        date: "March 14, 2022",
        Costco: 585766,
        "Cub Foods": 12250,
        "H-E-B": 291577,
        "Hy-Vee": 63056,
        Kroger: 560219,
        Meijer: 209766,
        Safeway: 197083
    },
    {
        date: "March 21, 2022",
        Costco: 589179,
        "Cub Foods": 12338,
        "H-E-B": 289558,
        "Hy-Vee": 61967,
        Kroger: 565127,
        Meijer: 205591,
        Safeway: 195422
    },
    {
        date: "March 28, 2022",
        Costco: 602646,
        "Cub Foods": 12675,
        "H-E-B": 308480,
        "Hy-Vee": 65720,
        Kroger: 571450,
        Meijer: 208437,
        Safeway: 196668
    },
    {
        date: "April 4, 2022",
        Costco: 591593,
        "Cub Foods": 13583,
        "H-E-B": 317745,
        "Hy-Vee": 69538,
        Kroger: 581203,
        Meijer: 213773,
        Safeway: 199723
    },
    {
        date: "April 11, 2022",
        Costco: 565913,
        "Cub Foods": 14843,
        "H-E-B": 312291,
        "Hy-Vee": 76318,
        Kroger: 652491,
        Meijer: 254488,
        Safeway: 218118
    },
    {
        date: "April 18, 2022",
        Costco: 617939,
        "Cub Foods": 12846,
        "H-E-B": 319087,
        "Hy-Vee": 69176,
        Kroger: 588743,
        Meijer: 213936,
        Safeway: 197370
    },
    {
        date: "April 25, 2022",
        Costco: 502195,
        "Cub Foods": 11390,
        "H-E-B": 276959,
        "Hy-Vee": 62229,
        Kroger: 533162,
        Meijer: 191100,
        Safeway: 177754
    },
    {
        date: "May 2, 2022",
        Costco: 384111,
        "Cub Foods": 10293,
        "H-E-B": 251434,
        "Hy-Vee": 54014,
        Kroger: 488278,
        Meijer: 170054,
        Safeway: 176984
    },
    {
        date: "May 9, 2022",
        Costco: 380826,
        "Cub Foods": 10079,
        "H-E-B": 238426,
        "Hy-Vee": 51336,
        Kroger: 458464,
        Meijer: 162096,
        Safeway: 163020
    },
    {
        date: "May 16, 2022",
        Costco: 398088,
        "Cub Foods": 10092,
        "H-E-B": 231876,
        "Hy-Vee": 50590,
        Kroger: 463101,
        Meijer: 166801,
        Safeway: 164070
    },
    {
        date: "May 23, 2022",
        Costco: 406301,
        "Cub Foods": 10301,
        "H-E-B": 242875,
        "Hy-Vee": 54703,
        Kroger: 487170,
        Meijer: 175053,
        Safeway: 170726
    },
    {
        date: "May 30, 2022",
        Costco: 373914,
        "Cub Foods": 10368,
        "H-E-B": 248888,
        "Hy-Vee": 53217,
        Kroger: 484208,
        Meijer: 167504,
        Safeway: 169449
    },
    {
        date: "June 6, 2022",
        Costco: 390120,
        "Cub Foods": 10055,
        "H-E-B": 233327,
        "Hy-Vee": 49710,
        Kroger: 443336,
        Meijer: 156321,
        Safeway: 164524
    },
    {
        date: "June 13, 2022",
        Costco: 364931,
        "Cub Foods": 9917,
        "H-E-B": 231345,
        "Hy-Vee": 49712,
        Kroger: 449016,
        Meijer: 159701,
        Safeway: 160715
    },
    {
        date: "June 20, 2022",
        Costco: 343095,
        "Cub Foods": 8601,
        "H-E-B": 205267,
        "Hy-Vee": 46031,
        Kroger: 402920,
        Meijer: 142671,
        Safeway: 142763
    },
    {
        date: "June 27, 2022",
        Costco: 360971,
        "Cub Foods": 9184,
        "H-E-B": 202029,
        "Hy-Vee": 50700,
        Kroger: 419129,
        Meijer: 142775,
        Safeway: 142785
    },
    {
        date: "July 4, 2022",
        Costco: 306076,
        "Cub Foods": 9089,
        "H-E-B": 192314,
        "Hy-Vee": 46632,
        Kroger: 396007,
        Meijer: 133703,
        Safeway: 136852
    },
    {
        date: "July 11, 2022",
        Costco: 342555,
        "Cub Foods": 8574,
        "H-E-B": 191461,
        "Hy-Vee": 45455,
        Kroger: 393612,
        Meijer: 131783,
        Safeway: 133706
    },
    {
        date: "July 18, 2022",
        Costco: 332562,
        "Cub Foods": 8405,
        "H-E-B": 182435,
        "Hy-Vee": 45138,
        Kroger: 381484,
        Meijer: 131557,
        Safeway: 132410
    },
    {
        date: "August 1, 2022",
        Costco: 358383,
        "Cub Foods": 8751,
        "H-E-B": 196259,
        "Hy-Vee": 46221,
        Kroger: 407832,
        Meijer: 138412,
        Safeway: 137063
    }
];

const datasets = [
    {
        label: "Costco",
        backgroundColor: "purple",
        borderColor: "purple",
        data: data.map((row) => row.Costco),
        hoverBorderColor: "black",
        hoverBorderWidth: "5"
    },
    {
        label: "Cub Foods",
        backgroundColor: "navy",
        borderColor: "navy",
        data: data.map((row) => row["Cub Foods"]),
        hoverBorderColor: "black",
        hoverBorderWidth: "5"
    },
    {
        label: "H-E-B",
        backgroundColor: "cyan",
        borderColor: "cyan",
        data: data.map((row) => row["H-E-B"]),
        hoverBorderColor: "black",
        hoverBorderWidth: "5"
    },
    {
        label: "Hy-Vee",
        backgroundColor: "green",
        borderColor: "green",
        data: data.map((row) => row["Hy-Vee"]),
        hoverBorderColor: "black",
        hoverBorderWidth: "5"
    },
    {
        label: "Kroger",
        backgroundColor: "yellow",
        borderColor: "yellow",
        data: data.map((row) => row["Kroger"]),
        hoverBorderColor: "black",
        hoverBorderWidth: "5"
    },
    {
        label: "Meijer",
        backgroundColor: "pink",
        borderColor: "pink",
        data: data.map((row) => row["Meijer"]),
        hoverBorderColor: "black",
        hoverBorderWidth: "5"
    },
    {
        label: "Safeway",
        backgroundColor: "red",
        borderColor: "red",
        data: data.map((row) => row["Safeway"]),
        hoverBorderColor: "black",
        hoverBorderWidth: "5"
    }
];

export const footTraffic = (canvas, cc) => {
    const config = {
        type: "bar",
        data: {
            labels: data.map((row) => row.date),
            datasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Foot traffic of US grocery stores"
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: false,
                        text: "day"
                    }
                },
                y: {
                    stacked: true,
                    minimum: 0,
                    title: {
                        display: false,
                        text: "Foot traffic"
                    }
                }
            }
        },
        plugins: [
            {
                id: "test",
                afterDatasetUpdate: (chart, args) => {
                    if (!args.mode) {
                        return;
                    }
                    ref?.setCategoryVisibility(
                        groups[args.index],
                        args.mode === "show"
                    );
                }
            }
        ]
    };

    const groups = datasets.map(({ label }) => label);

    const myChart = new Chart(canvas, config);

    const c2mConfig = {
        type: "bar",
        title: config.options.plugins.title.text,
        element: canvas,
        cc,
        axes: {
            x: {
                valueLabels: data.map(({ date }) => date)
            },
            y: {
                format: (y) => y.toLocaleString()
            }
        },
        data: Object.fromEntries(
            datasets.map(({ label, data }) => [label, data])
        ),
        options: {
            onFocusCallback: ({ slice, index }) => {
                const toHighlight = [];
                if (slice === "All") {
                    ref._visible_group_indices.slice(1).forEach((g) => {
                        toHighlight.push({ datasetIndex: g - 1, index });
                    });
                } else {
                    toHighlight.push({
                        datasetIndex: groups.indexOf(slice),
                        index
                    });
                }

                myChart.setActiveElements(toHighlight);
                myChart?.tooltip?.setActiveElements(toHighlight, {});
                myChart.update();
            },
            stack: true
        }
    };

    const { err, data: ref } = c2mChart(c2mConfig);
    if (err) {
        console.error(err);
    }
};
