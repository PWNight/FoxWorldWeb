// for page navigation & to sort on leftbar
export const ROUTES = [
  { title:"Оглавление",
    href:"",
    items: [
    ]
  },
  {
    title: "Введение",
    href: "introduction",
    items: [
      { title: "О нас", href: "/about" },
      { title: "Часто задаваемые вопросы", href: "/faq" },
      { title: "Команды", href: "/commands" },
      { title: "Начать играть", href: "/start-game" },
    ],
  },
];

export const page_routes = ROUTES.map(({ href, items }) => {
  return items.map((link) => {
    return {
      title: link.title,
      href: href + link.href,
    };
  });
}).flat();
