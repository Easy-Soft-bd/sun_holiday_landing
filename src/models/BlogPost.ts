import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/db';

export type BlogPostStatus = 'Draft' | 'Active' | 'Inactive';

interface BlogPostAttributes {
  id: number;
  title: string;
  /** URL segment for public blog pages (unique). */
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  content: string;
  status: BlogPostStatus;
  /** When the post goes live; used for display date and SEO. */
  publishedAt: Date | null;
  /** Optional SEO overrides (fall back to title / excerpt). */
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BlogPostCreationAttributes
  extends Optional<
    BlogPostAttributes,
    'id' | 'status' | 'publishedAt' | 'metaTitle' | 'metaDescription' | 'slug'
  > {}

class BlogPost
  extends Model<BlogPostAttributes, BlogPostCreationAttributes>
  implements BlogPostAttributes
{
  declare id: number;
  declare title: string;
  declare slug: string;
  declare excerpt: string;
  declare category: string;
  declare image: string;
  declare content: string;
  declare status: BlogPostStatus;
  declare publishedAt: Date | null;
  declare metaTitle: string | null;
  declare metaDescription: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BlogPost.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: 'Travel Tips',
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Draft', 'Active', 'Inactive'),
      defaultValue: 'Draft',
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'blog_posts',
    timestamps: true,
  }
);

export default BlogPost;
