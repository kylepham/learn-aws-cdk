import { Chance } from "chance";

export default () => {
  const chance = new Chance();

  const firstName = chance.first({ nationality: "en" });
  const lastName = chance.last({ nationality: "en" });
  const name = `${firstName} ${lastName}`;
  const suffix = chance.string({ length: 8, pool: "abcdefghijklmnopqrstuvwxyz" });
  const email = `0_test_${firstName}_${lastName}-${suffix}@aws.amazon.com`;
  const password = chance.string({ length: 10 });

  return {
    name,
    email,
    password,
  } as const;
};
