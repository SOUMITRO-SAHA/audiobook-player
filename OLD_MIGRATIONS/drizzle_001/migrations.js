// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from "./meta/_journal.json";
import m0000 from "./0000_lyrical_moonstone.sql";
import m0001 from "./0001_dear_joseph.sql";
import m0002 from "./0002_mixed_wiccan.sql";
import m0003 from "./0003_supreme_the_hunter.sql";
import m0004 from "./0004_friendly_miracleman.sql";
import m0005 from "./0005_bright_jimmy_woo.sql";

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004,
    m0005,
  },
};
