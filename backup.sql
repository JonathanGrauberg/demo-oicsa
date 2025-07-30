--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: obra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.obra (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    ubicacion character varying(200),
    estado character varying(50) DEFAULT 'En progreso'::character varying,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.obra OWNER TO postgres;

--
-- Name: obra_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.obra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.obra_id_seq OWNER TO postgres;

--
-- Name: obra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.obra_id_seq OWNED BY public.obra.id;


--
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    tipo character varying(50) NOT NULL,
    cantidad numeric NOT NULL,
    unidad character varying(20) NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT stock_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['Combustible'::character varying, 'Lubricante'::character varying])::text[]))),
    CONSTRAINT stock_unidad_check CHECK (((unidad)::text = 'litros'::text))
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_id_seq OWNER TO postgres;

--
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_id_seq OWNED BY public.stock.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    nombre text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    rol text NOT NULL,
    apellido text NOT NULL,
    CONSTRAINT chk_rol CHECK ((rol = ANY (ARRAY['encargado'::text, 'administrativo'::text, 'superusuario'::text, 'aprobador'::text])))
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: vale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vale (
    id integer NOT NULL,
    combustible_lubricante text,
    litros numeric,
    vehiculo text,
    obra text,
    destino text,
    encargado text,
    solicitado_por integer,
    fecha date,
    aprobado boolean DEFAULT false,
    aprobado_por integer,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    kilometraje integer,
    origen character varying(50) DEFAULT 'obrador'::character varying
);


ALTER TABLE public.vale OWNER TO postgres;

--
-- Name: vale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vale_id_seq OWNER TO postgres;

--
-- Name: vale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vale_id_seq OWNED BY public.vale.id;


--
-- Name: vehiculo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculo (
    id integer NOT NULL,
    tipo text,
    marca text,
    modelo text,
    patente text,
    ano integer,
    kilometraje integer,
    chasis text,
    motor text,
    neumaticos_delantero text,
    neumaticos_traseros text,
    aceite_motor text,
    aceite_caja text,
    filtro_aceite text,
    combustible text,
    filtro_aire_primario text,
    filtro_aire_secundario text,
    filtro_combustible_primario text,
    filtro_combustible_secundario text,
    observaciones text,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vehiculo OWNER TO postgres;

--
-- Name: vehiculo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehiculo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehiculo_id_seq OWNER TO postgres;

--
-- Name: vehiculo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehiculo_id_seq OWNED BY public.vehiculo.id;


--
-- Name: obra id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obra ALTER COLUMN id SET DEFAULT nextval('public.obra_id_seq'::regclass);


--
-- Name: stock id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock ALTER COLUMN id SET DEFAULT nextval('public.stock_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Name: vale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vale ALTER COLUMN id SET DEFAULT nextval('public.vale_id_seq'::regclass);


--
-- Name: vehiculo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo ALTER COLUMN id SET DEFAULT nextval('public.vehiculo_id_seq'::regclass);


--
-- Data for Name: obra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.obra (id, nombre, descripcion, ubicacion, estado, creado_en) FROM stdin;
1	Puente Berlin	creacion del puente	Paraná	En progreso	2025-07-18 12:44:06.322091
2	Thompson	Arenado	Paraná	Finalizada	2025-07-18 13:01:29.793499
\.


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock (id, nombre, tipo, cantidad, unidad, creado_en) FROM stdin;
2	Aceite 10W40	Lubricante	490	litros	2025-07-18 13:32:20.068412
3	Diesel	Combustible	480	litros	2025-07-18 13:58:22.500984
1	Nafta Super	Combustible	700	litros	2025-07-18 13:32:20.068412
5	2daprueba	Combustible	878	litros	2025-07-18 18:10:01.114305
4	PruebadeMiL	Combustible	2000	litros	2025-07-18 18:06:51.988562
6	celular	Combustible	4	litros	2025-07-30 09:31:13.002011
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id, nombre, email, password, rol, apellido) FROM stdin;
3	Jonathan	webibygrauberg@gmail.com	$2b$10$/WZkwFdwn89pMAj3j7SXuuL30rWbQ2lP8AYeU020OefHHJi0rUaoa	administrativo	Grauberg
4	juan	jajaj@gmail.com	$2b$10$JTBP0xW1gOrOAZ/WZbIK.OLwu/hmXBDFtQ.EoYL/Zl4sc2qtqOjcy	superusuario	grauberg
6	Ana	ana@demo.com	hash	administrativo	Gomez
8	Luis	luis@demo.com	hash	aprobador	Martinez
7	Carlos	carlos@demo.com	hash	encargado	Lopez
1	Jonathan	jonathangrauberg@gmail.com	$2b$10$vlJHcxqm0iNDar.Z.DBtVOyMqyORh9b4OTtlaC.x5RaDSyarQ.37a	encargado	Grauberg
5	Juan	juan@demo.com	$2b$10$3isjD6aKDygAvIjICqUFTevluW3VmQLsn5nrTigOI5XTx29rrqcwa	superusuario	Perez
11	Juan 	gomez@gmail.com	$2b$10$zP1VfTbVfOs7TZoGT8SnYeFaoOgGtU0scOlRjYk/ErxgUja4.5nIa	encargado	Gomez
\.


--
-- Data for Name: vale; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vale (id, combustible_lubricante, litros, vehiculo, obra, destino, encargado, solicitado_por, fecha, aprobado, aprobado_por, creado_en, kilometraje, origen) FROM stdin;
1	nafta oil	44	honda rav4	parana	parana	juan	1	2025-06-19	t	1	2025-06-19 17:52:15.279684	\N	obrador
2	yerba mate	100	alguno	no se	allá	alguien	1	2025-06-19	t	1	2025-06-19 18:01:54.097569	\N	obrador
3	GAS	10	3	ELI	CASA ELI	ELIANA SANCHEZ	1	2025-06-26	t	1	2025-06-26 12:14:49.115055	\N	obrador
7	ACEITE 	45	5	parana	CASA RUSO	juan	1	2025-06-26	t	1	2025-06-26 19:07:38.259152	\N	obrador
6	fernet	123	1	kokoko	lklklkl	okokoko	1	2025-06-26	t	1	2025-06-26 17:30:56.588858	\N	obrador
8	Nafta Super	46	4	Telecom	Seguí	Jonathan	1	2025-06-28	t	1	2025-06-27 21:10:30.156982	179	obrador
9	Diesel	10	1	Thompson	parana	Jonathan	1	2025-07-18	t	1	2025-07-18 14:04:46.337957	10000	obrador
11	Aceite 10W40	10	4	Thompson	OBRADOR	Jonathan	1	2025-07-18	t	1	2025-07-18 14:59:48.192689	16545	obrador
13	Diesel	10	3	Thompson	parana	Jonathan	1	2025-07-18	t	1	2025-07-18 15:17:26.353169	65465489	obrador
12	Nafta Super	150	1	Thompson	Obrador	Jonathan	1	2025-07-18	t	1	2025-07-18 15:10:59.523375	159658	obrador
14	Nafta Super	50	4	Puente Berlin	parana	Jonathan	1	2025-07-18	t	1	2025-07-18 15:19:57.217405	165465456	obrador
15	2daprueba	122	2	Thompson	parana	Jonathan	1	2025-07-18	t	1	2025-07-18 18:13:20.254276	1121212	obrador
16	PruebadeMiL	55	1	Thompson	Obrador	Jonathan	1	2025-07-19	f	\N	2025-07-19 12:07:18.47956	130000	obrador
17	Diesel	12222	3	Puente Berlin	Obrador	Jonathan	1	2025-07-19	f	\N	2025-07-19 12:08:27.011261	135459	obrador
18	Diesel	44	5	Puente Berlin	ypf	Jonathan	1	2025-07-19	f	\N	2025-07-19 12:10:10.25726	16549	obrador
19	PruebadeMiL	-1000	1	Thompson	parana	Jonathan	1	2025-07-22	t	1	2025-07-22 19:49:13.372202	1651561	obrador
20	2daprueba	400	1	Thompson	parana	Juan  Gomez	11	2025-07-30	f	\N	2025-07-30 08:50:12.39147	1645789	estacion
\.


--
-- Data for Name: vehiculo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehiculo (id, tipo, marca, modelo, patente, ano, kilometraje, chasis, motor, neumaticos_delantero, neumaticos_traseros, aceite_motor, aceite_caja, filtro_aceite, combustible, filtro_aire_primario, filtro_aire_secundario, filtro_combustible_primario, filtro_combustible_secundario, observaciones, creado_en) FROM stdin;
1	Auto	Honda	otro	AA 111 BB	\N	16548798	chasis	motor	\N	\N	\N	\N	\N	C1	\N	\N	\N	\N	NADA PAR AOBSERVAR	2025-06-18 12:12:33.004533
2	Camión	Honda	Gol	aa 124 cd	\N	16547	979	979	\N	\N	\N	\N	\N	7979	\N	\N	\N	\N	654654	2025-06-18 12:15:15.867244
3	Camión	Honda	Kangoo	646646	6464646	6464646	6464464	6464666	4646464	646444646	646464646	46464646	46464646	464646464	64646464	64646464	64646464	6464646	6464646464	2025-06-19 11:54:01.754807
4	Grúa	Audi	A4	456456	1998	78987	789789	78978978978												2025-06-26 19:00:32.452692
5	Camión	Honda	Kangoo		1998	1918189	6464464	motor	nd	nt	am	ac	mhjgj	ghjgj	ghjghjg	hjghjg	ghjghj	ghjghj	ghjjjhjhhhhh	2025-06-26 19:01:35.66052
\.


--
-- Name: obra_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.obra_id_seq', 2, true);


--
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_id_seq', 6, true);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_seq', 11, true);


--
-- Name: vale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vale_id_seq', 20, true);


--
-- Name: vehiculo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vehiculo_id_seq', 5, true);


--
-- Name: obra obra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.obra
    ADD CONSTRAINT obra_pkey PRIMARY KEY (id);


--
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: vale vale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vale
    ADD CONSTRAINT vale_pkey PRIMARY KEY (id);


--
-- Name: vehiculo vehiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_pkey PRIMARY KEY (id);


--
-- Name: vale vale_aprobado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vale
    ADD CONSTRAINT vale_aprobado_por_fkey FOREIGN KEY (aprobado_por) REFERENCES public.usuario(id);


--
-- Name: vale vale_solicitado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vale
    ADD CONSTRAINT vale_solicitado_por_fkey FOREIGN KEY (solicitado_por) REFERENCES public.usuario(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

