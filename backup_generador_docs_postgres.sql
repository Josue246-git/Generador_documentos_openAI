PGDMP  *    (                |            db_generador_docs_openAI    16.4    16.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    41016    db_generador_docs_openAI    DATABASE     �   CREATE DATABASE "db_generador_docs_openAI" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
 *   DROP DATABASE "db_generador_docs_openAI";
                postgres    false            �            1259    41029    estr_documentos    TABLE     �  CREATE TABLE public.estr_documentos (
    id integer NOT NULL,
    titulo text NOT NULL,
    prompt_user text NOT NULL,
    contexto_base text NOT NULL,
    puntos text[] NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    descripcion text NOT NULL,
    encabezado text[],
    piepagina text[],
    fecha_actualizacion timestamp without time zone
);
 #   DROP TABLE public.estr_documentos;
       public         heap    postgres    false            �            1259    41028    estr_documentos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.estr_documentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.estr_documentos_id_seq;
       public          postgres    false    216            �           0    0    estr_documentos_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.estr_documentos_id_seq OWNED BY public.estr_documentos.id;
          public          postgres    false    215            �            1259    57461    users    TABLE     b  CREATE TABLE public.users (
    id integer NOT NULL,
    cedula character(10) NOT NULL,
    nombre character varying(50) NOT NULL,
    apellido character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_cedula_check CHECK (((char_length(cedula) = 10) AND (cedula ~ '^[0-9]+$'::text))),
    CONSTRAINT users_rol_check CHECK (((rol)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    57460    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    218            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    217            U           2604    41032    estr_documentos id    DEFAULT     x   ALTER TABLE ONLY public.estr_documentos ALTER COLUMN id SET DEFAULT nextval('public.estr_documentos_id_seq'::regclass);
 A   ALTER TABLE public.estr_documentos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            W           2604    57464    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            �          0    41029    estr_documentos 
   TABLE DATA           �   COPY public.estr_documentos (id, titulo, prompt_user, contexto_base, puntos, fecha_creacion, descripcion, encabezado, piepagina, fecha_actualizacion) FROM stdin;
    public          postgres    false    216   �       �          0    57461    users 
   TABLE DATA           _   COPY public.users (id, cedula, nombre, apellido, password, rol, email, created_at) FROM stdin;
    public          postgres    false    218   g#       �           0    0    estr_documentos_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.estr_documentos_id_seq', 4, true);
          public          postgres    false    215            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 10, true);
          public          postgres    false    217            \           2606    41037 $   estr_documentos estr_documentos_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.estr_documentos
    ADD CONSTRAINT estr_documentos_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.estr_documentos DROP CONSTRAINT estr_documentos_pkey;
       public            postgres    false    216            ^           2606    57471    users users_cedula_key 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cedula_key UNIQUE (cedula);
 @   ALTER TABLE ONLY public.users DROP CONSTRAINT users_cedula_key;
       public            postgres    false    218            `           2606    57469    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    218            �   Z  x��XM��F=�E����F�4ߺ,h�3a�R��@��%�C�
��dH�9��b/�,������_�����8F��a`(�Y]����+���d�f+I��D�R�HDR�gL��V�,II��I�Jq[�2�3��EĿ�^��m���Sr�7�=������0�Źо�&�@f"��؁�,o�Ʌ�.)仔|���
{��d�MZ��$����J�"�I�e���J�.S�J䎮<��	h��ȱ��X��p�w8�
sݢ[�a M(_J��B�4ϰ�]�}C�>M&�8��-�
cI��v���C/��6���B�$�;q�IDK	ρCi;ɢ>KD:ϊ0/���۝2�(b�+ ֟%G4�aƘ:oeX�
@]�w,`����CBA���A���3��~,h.å���7x�]�����d!i��i�ncy�m�'���=y�b�[�Ba�`K�4BT��8	�y���6�rM����p�	�����\�E��MVPϒ�K��B&HS|i�������c٢%�Td��#�`#Ė1.4�/�"3���(��*ä�0.��$<�6	��ؕL~[�LFm��ϻm:<��Q(#x%��a��]�����K/$���T�@��,��H"�Eث��.R���y�9!�ڇ���8�%���,q��si^��S��!V�:!E�����[�4Ŏ��:�W��2{�p�q��O�?e+�"[�Z§^����$M"��
��+��
�Q�b띆U,�SqL��$��NF�}��es��W��>}��cv��(�6&9����o����VXd��:K��n" �e��=*8Ө��}l�Hi2���>�q{7�wi�L�i�NU�W8���.�ݹC��(��:VR�H�0_��|pz�z����`�eZđ�^�`p�I�]���a��6ŀ�����R���,}�@|.�k-2���zYm�G�-�߭c��z�tm
ް�9-W��u�K�ݛS�YU$�|h';�{�ږ�z#�ıG���K��y��Ε�;#۵��,��e
8�x@�H���+��̈@̸f��L�H�|��*R2)[��\�"F�i�����5�V�!R`�rM�-������槡��tF�v����78?������5���A��&�L������3�. ��'Hޣ_�n����tT��66E��g��k�=o���7
���дс3�_M߽���$YY�u�p��H l��ELe($=������b�2��X2�i-%?1����u����dc��/��$%&-�[�X���]��B#JâljM�n3����{�N������O�������������50A�f$M����1 �R�mL���['W��5B��է�h�Q�XI�Bl�����;���E�N�>n5�:OA�#�����-��;@�{��<���ܢ^�s�9��������M曏ȁ����j-�� �p��]Ƨ\[�|e���JP���)'�}X���
s/̒�e�e�`���q�{���`�=P�E�H�}��x�93��%��������^��A�Zd{��oM��_GtD����]�SV��\����"[�Ŗ�#���{��24!s�5��!�oG!?TN\��lM"�>urn��ha��0±�b�����M�O�+h��d[Hf�ğ%�6{G*S���L�u��@�0��~U�<=jDs度�H�[d6�%���r����.�҂r��U��<Z-
ern{�>��j�!Ͽ����10�]'΍E#<���`�7�|9��>6�"�V�0~���螵����Ǐ�>�s�D�����Om�T@�Y�wKO�ͯ��k�x�O&�5���aϜa����|:6>��yIH���Z��CkT%,��]�#k�5�>l�Ӗ���Ӷ����к1�q�n�n���{���r��V���i��zT_5�'�ս�i����W�v}��^ v|d`v_Y��F����IGL4G��8=n�Xd��dF*���r�#�^�$�R�*S���g���Ѝ*�i��9����������O�T��J �s����j�P��y��Ýr�B�3n�� ��$�?�j�
�~&)'hq��@��!�!�4����Nc�˩��e`�����~�0�#��u�W�`I���6�����#�ӣ���I��Ї�����JO\��77����L�Sp�W����%ݎ��л��bUO�F��c�梏��=t��&��JTʄ'Ú��]�^��x*tc&�fT9���I3����� ��"�mBGl&08��r\r5��B��Ny� �h���V)&4Ȋ�������9�z�g1/5E��>MgӘ��e�ڊ�JB=�z��L[ȋ�~�M�U�u�g�PZ�vJy��c�"b7 <S�=)Ӟ�fY�C��a�����W�������嘰���o��$ �?������T�F>zf�1�-�8$#�vq5�D���3���q�*j�f %���(͠(��m* ����3�c�o�Ε�P��c�l0E�dXʺ�U9 銸$8�i��՚�{�1����[)�j��i?�{��+�Yr�p�d[%���*8����Ȑ�O㊑+\�a
��b&n��Q�h*���=��q�3����v]}�0;���7�͜�;:�R��r��\�O�;��{�F�&��[Mt|�WN5GH��ᇖ�Z���ф�;\�x���0���旫Rh<��dV�v)21��S��ߴ���S+�Wteن�xd���nf�ì����S�<���7g��7�����rYa��fD�q����)����`o>DE,�%O-|1�k	�o梒���4�$�`�f�y@��������I�=��6�ʯ5�۱5l�$��������J�4hJ�9��%L{�Ԣ<M� �3vq����^�	�'��� ��\f��heܷ|�ɰ�����JG?���
����_YA��=�ZÃ>}�_�b���e-JA��f�VGw�	uZ~�*����mӾ,���̰�{��kЄb����~=��==�ws1��~��<�s��s8��kEs�����q��?����������ɽ���n/��<�_�.�k�V1 e$��E����/σA+\YW�q}�~���� ��8      �   �   x���1�0����+ܥ�.���N
.
:8��mR
�B���^D�&~�������q���xY/ƾ���F'�m��	]��l�ؗ���n(q��n*`�pET�zc���0k�䷈�Z�i\c����=�4C���S�аh�,���Ro�:     