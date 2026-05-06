export interface NavItem {
  label: string;
  icon: string;
  route: string;
  children?: NavItem[];
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
  {
    label: 'Customers',
    icon: 'pi pi-users',
    route: '/customers',
  },
  {
    label: 'Users & Roles',
    icon: 'pi pi-user-plus',
    route: '',
    children: [
      { label: 'Users', icon: 'pi pi-user', route: '/users' },
      { label: 'Roles', icon: 'pi pi-shield', route: '/roles' },
    ],
  },
  {
    label: 'Catalogs',
    icon: 'pi pi-book',
    route: '',
    children: [
      { label: 'Templates', icon: 'pi pi-desktop', route: '/templates' },
      { label: 'Lead Types', icon: 'pi pi-bolt', route: '/lead-types' },
      { label: 'Property Types', icon: 'pi pi-home', route: '/property-types' },
      { label: 'Property Subtypes', icon: 'pi pi-th-large', route: '/property-subtypes' },
      { label: 'Cities', icon: 'pi pi-map-marker', route: '/cities' },
    ],
  },
  {
    label: 'Properties',
    icon: 'pi pi-building',
    route: '/properties',
  },
  {
    label: 'Audit Logs',
    icon: 'pi pi-history',
    route: '/audit-logs',
  },
];