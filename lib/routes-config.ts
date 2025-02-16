export type EachRoute = {
  title: string;
  href: string;
  noLink?: true;
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: "Оглавление",
    href: "/",
  },
  {
    title: "Правила",
    href: "/rules",
  },
  {
    title: "Основное",
    href: "/introduction",
    noLink: true,
    items: [
      { title: "О нас", href: "/about" },
      { title: "Команды", href: "/commands" },
      { title: "FAQ", href: "/faq" },
      { title: "Начать игру", href: "/start-game" },
    ],
  },
  {
    title: "Гайды",
    href: "/guides",
    noLink: true,
    items: [
      { title: "Управление эмблемами", href: "/emblems" },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
