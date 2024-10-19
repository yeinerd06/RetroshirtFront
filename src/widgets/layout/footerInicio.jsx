import { Typography, IconButton } from "@material-tailwind/react";
import { BsFacebook, BsInstagram, BsX } from "react-icons/bs";

const LINKS = [
  {
    title: "PRODUCTOS",

    items: [
      {
        title: "Camisetas",

        href: "#",
      },

      {
        title: "Estampados",

        href: "#",
      },

      {
        title: "Diseños",

        href: "#",
      },

    
    ],
  },

  {
    title: "COMPAÑIA",

    items: [
      {
        title: "WEBSITE ",

        href: "#",
      },

      {
        title: "DIAN",

        href: "#",
      },

      {
        title: "RUT",

        href: "#",
      },

    ],
  },

  {
    title: "CONTACTO",

    items: [
      {
        title: "contacto@retro-shirt.com",

        href: "#",
      },

      {
        title: "3100 Santa Monica Blvd",

        href: "#",
      },

      {
        title: "+57 304 345 0234",

        href: "#",
      },

     
    ],
  },
];

const YEAR = new Date().getFullYear();

export function FooterInicio() {
  return (
    <footer className="relative w-full  border-t border-gray-900  border-surface py-4 bg-white">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <Typography type="h6" className="mb-4">
          RETRO SHIRT
          </Typography>

          <div className="grid grid-cols-3 justify-between gap-x-6 gap-y-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography className="mb-2 font-semibold ">
                  {title}
                </Typography>

                {items.map(({ title, href }) => (
                  <li key={title}>
                    <Typography
                      as="a"
                      href={href}
                      className="py-1 hover:text-primary"
                    >
                      {title}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-10   flex w-full flex-col items-center justify-center gap-4 border-t border-surface py-4 md:flex-row md:justify-between">
          <Typography type="small" className="text-center">
           <strong> &copy; {YEAR} RETRO SHIRT  Rights Reserved.</strong> {""}
           
           
          </Typography>
            <div className="flex gap-1 sm:justify-center text-dark">
              <IconButton
                as="a"
                href="#"
                color="secondary"
                variant="ghost"
                size="sm"
              >
                <BsFacebook className="h-4 w-4" />
              </IconButton>

              <IconButton
                as="a"
                href="#"
                color="secondary"
                variant="ghost"
                size="sm"
              >
                <BsInstagram className="h-4 w-4" />
              </IconButton>

              <IconButton
                as="a"
                href="#"
                color="secondary"
                variant="ghost"
                size="sm"
              >
                <BsX className="h-4 w-4" />
              </IconButton>

             

              
              </div>
      
        </div>
      </div>
    </footer>
  );
}
