const data_r18 =  (key) => {
    this.filename = (key) => {
        const list = {
                "star": "1star",
                "sace": "1sace",
                "sddm": "1sddm",
                "sdde": "1sdde",
                "sdds": "1sdds",
                "sdmt": "1sdmt",		
                "sdmu": "1sdmu",
                "sdnm": "1sdnm",
                "sden": "1sden",
                "svdvd": "1svdvd",
                "sw": "1sw",
                "iscr": "1iscr",
                "iesp": "1iesp",
                "idol": "1idol",
                "iene": "1iene",
                "fset": "1fset",
                "open": "1open",
                "gs": "1gs",
                "hbad": "1hbad",
                "rct": "1rct",
                "rctd": "1rctd",
                "kmhr": "1kmhr",
                "kwpo": "1kwpo",
                "dandy": "1dandy",
                "dvd": "1dvd",
                "dvdes": "1dvdes",
                "dvdps": "1dvdps",
                "trct": "1trct",
                "ngks": "1ngks",
                "nhdtb": "1nhdtb",
                "nhdta": "1nhdta",
                "nhdt": "1nhdt",
                "nhvr": "1nhvr",
                "mmgh": "1mmgh",
                "mane": "1mane",
                "cwm": "2cwm",
                "dje": "2dje",
                "dgre": "2dgre",
                "dfdm": "2dfdm",
                "ekai": "2ekai",
                "ecb": "2ecb",
                "hgwp": "2hgwp",
                "yvh": "2yvh",
                "wsp": "2wsp",
                "wwk": "2wwk",
                "wpvr": "2wpvr",
                "wdi": "2wdi",
                "wanz": "3wanz",
                "wnz": "3wnz",
                "wnzs": "3wnzs",
                "wfs": "3wfs",
                "wf": "3wf",
                "wfs": "3wfs",
                "nama": "3nama",
                "sfw": "3sfw",
                "val": "12val",
                "lol": "12lol",
                "avg": "13avg",
                "ayb": "13ayb",
                "box": "13box",
                "gvg": "13gvg",
                "gqe": "13gqe",
                "hvg": "13hvg",
                "mvg": "13mvg",
                "ovg": "13ovg",
                "rvg": "13rvg",
                "sgv": "13sgv",
                "sqv": "13sqv",
                "yvg": "13yvg",
                "djr": "15djr",
                "dim": "15dim",
                "dme": "15dme",
                "ddka": "15ddka",
                "cmd": "24cmd",
                "hfd": "24hfd",
                "fsd": "24fsd",
                "mzd": "24mzd",
                "lid": "24lid",
                "ned": "24ned",
                "pzd": "24pzd",
                "ufd": "24ufd",
                "qbd": "24qbd",
                "vdd": "24vdd",
                "pk": "36pk",
                "tdsu": "36tdsu",
                "doks": "36doks",
                "dmow": "36dmow",
                "dic": "36dic",
                "drop": "36drop",
                "did": "36did",
                "dili": "36dili",
                "dksm": "36dksm",
                "hmpd": "41hmpd",
                "hodv": "41hodv",
                "bndv": "41bndv",
                "adz": "47adz",
                "cadv": "49cadv",
                "ekdv": "49ekdv",
                "fa": "49fa",
                "he": "49he",
                "madm": "49madm",
                "mvs": "49mvs",
                "mva": "49mva",
                "nitr": "49nitr",
                "porn": "49porn",
                "pe": "49pe",
                "sc": "49sc",
                "tmhk": "49tmhk",
                "akb": "55akb",
                "adi": "55adi",
                "aikb": "55aikb",
                "htma": "55htma",
                "boya": "55boya",
                "ksdo": "55ksdo",
                "tsms": "55tsms",
                "tmaf": "55tmaf",
                "bazx": "61bazx",
                "rmds": "61rmds",
                "mdb": "61mdb",
                "mds": "61mds",
                "mdtm": "61mdtm",
                "bzvr": "84bzvr",
                "kmvr": "84kmvr",
                "mkmp": "84mkmp",
                "mild": "84mild",
                "umso": "84umso",
                "okax": "84okax",
                "okad": "84okad",
                "abp": "118abp",
                "ama": "118ama",
                "abs": "118abs",
                "afs": "118afs",
                "aka": "118aka",
                "any": "118any",
                "bgn": "118bgn",
                "chn": "118chn",
                "cdc": "118cdc",
                "cmi": "118cmi",
                "dic": "118dic",
                "docp": "118docp",
                "dcx": "118dcx",
                "esk": "118esk",
                "fch": "118fch",
                "fnc": "118fnc",
                "ftn": "118ftn",
                "fis": "118fis",
                "fiv": "118fiv",
                "goal": "118goal",
                "gets": "118gets",
                "good": "118good",
                "giro": "118giro",
                "har": "118har",
                "hcm": "118hcm",
                "jbs": "118jbs",
                "job": "118job",
                "kbh": "118kbh",
                "kkj": "118kkj",
                "lxvs": "118lxvs",
                "long": "118long",
                "mgt": "118mgt",
                "mzq": "118mzq",
                "mas": "118mas",
                "nrs": "118nrs",
                "nmp": "118nmp",
                "npv": "118npv",
                "once": "118once",
                "onez": "118onez",
                "pbs": "118pbs",
                "ppt": "118ppt",
                "pxh": "118pxh",
                "prd": "118prd",
                "rix": "118rix",
                "rdd": "118rdd",
                "rddp": "118rddp",
                "rdt": "118rdt",
                "rtp": "118rtp",
                "sga": "118sga",
                "srs": "118srs",
                "tem": "118tem",
                "ths": "118ths",
                "tre": "118tre",
                "tus": "118tus",
                "ult": "118ult",
                "yrh": "118yrh",
                "yrz": "118yrz",
                "bdd": "143bdd",
                "dsts": "145dsts",
                "rd": "149rd",
                "xrw": "172xrw",
                "real": "172real",
                "oned": "433oned",
                "natr": "h_067natr",
                "srxv": "h_105srxv",
                "saba": "h_244saba",
                "love": "h_491love",
                "fone": "h_491fone",
                "very": "h_491very",
                "ktif": "h_491ktif",
                "fsre": "h_491fsre",
                "fstb": "h_491fstb",
                "fstc": "h_491fstc",
                "fstd": "h_491fstd",
                "fsta": "h_491fsta",
                "fste": "h_491fste",
                "fskt": "h_491fskt",
                "tmdi": "h_452tmdi",
                "scop": "h_565scop",
                "mks": "h_618mks",
                "mnri": "h_618mnri",
                "mdjy": "h_618mdjy",
                "mkz": "h_618mkz",
                "mzro": "h_618mzro",
                "mmgm": "h_618mmgm",
                "mnrs": "h_618mnrs",
                "mhip": "h_618mhip",
                "mnimz": "h_618mnimz",
                "mhso": "h_618mhso",
                "sexy": "h_697sexy",
                "tbtb": "h_840tbtb",
                "vspds": "h_910vspds",
        }

        return list[key] || key;
    }
}

module.exports = data_r18